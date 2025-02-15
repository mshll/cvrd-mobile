import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '@/config/env';
import { stores } from '@/data/stores2';
import { subscriptions } from '@/data/subscriptions';
import { MERCHANTS } from '@/data/merchants';

// Initialize Gemini AI
if (!ENV.GEMINI_API_KEY) {
  console.error('Gemini API key is missing. Please check your environment configuration.');
}
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

function analyzeTransactions(transactions) {
  // Filter for approved transactions only
  const approvedTransactions = transactions.filter((t) => t.status === 'APPROVED');

  // Group transactions by merchant
  const merchantFrequency = approvedTransactions.reduce((acc, t) => {
    acc[t.merchant] = (acc[t.merchant] || 0) + 1;
    return acc;
  }, {});

  // Group transactions by category
  const categorySpending = approvedTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  // Find most used merchant
  const mostUsedMerchant = Object.entries(merchantFrequency).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  // Find highest spending category
  const highestSpendingCategory = Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  // Analyze recurring transactions with subscription data
  const recurringTransactions = approvedTransactions
    .filter((t) => t.recurring)
    .map((t) => {
      // Find matching subscription service
      const subscriptionService = subscriptions.find(
        (s) =>
          s.name.toLowerCase() === t.merchant.toLowerCase() || t.merchant.toLowerCase().includes(s.name.toLowerCase())
      );

      // Find matching merchant
      const merchant = MERCHANTS.find(
        (m) =>
          m.name.toLowerCase() === t.merchant.toLowerCase() || t.merchant.toLowerCase().includes(m.name.toLowerCase())
      );

      return {
        merchant: t.merchant,
        amount: t.amount,
        category: t.category,
        date: new Date(t.createdAt),
        type: t.type,
        // Add subscription data if available
        subscriptionData: subscriptionService
          ? {
              lowestTier: Math.min(...subscriptionService.plans.map((p) => p.price)),
              currentTier: subscriptionService.plans.find((p) => Math.abs(p.price - t.amount) < 0.5)?.name || 'Unknown',
              potentialSavings: t.amount - Math.min(...subscriptionService.plans.map((p) => p.price)),
            }
          : null,
        merchantData: merchant || null,
      };
    });

  // Calculate total recurring spend
  const totalRecurringSpend = recurringTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Group recurring transactions by merchant with enhanced analysis
  const recurringByMerchant = recurringTransactions.reduce((acc, t) => {
    if (!acc[t.merchant]) {
      acc[t.merchant] = {
        total: 0,
        count: 0,
        category: t.category,
        subscriptionData: t.subscriptionData,
        merchantData: t.merchantData,
      };
    }
    acc[t.merchant].total += t.amount;
    acc[t.merchant].count++;
    return acc;
  }, {});

  // Analyze store-specific spending
  const storeSpending = approvedTransactions.reduce((acc, t) => {
    const store = stores.find(
      (s) =>
        s.name.toLowerCase() === t.merchant.toLowerCase() || t.merchant.toLowerCase().includes(s.name.toLowerCase())
    );
    if (store) {
      if (!acc[store.name]) {
        acc[store.name] = {
          total: 0,
          count: 0,
          category: store.category,
          averageItemPrice: store.items.reduce((sum, item) => sum + item.price, 0) / store.items.length,
        };
      }
      acc[store.name].total += t.amount;
      acc[store.name].count++;
    }
    return acc;
  }, {});

  // Find potential subscription downgrades
  const findPotentialDowngrades = (recurringTransactions) => {
    const potentialSavings = recurringTransactions
      .filter((t) => t.subscriptionData && t.subscriptionData.potentialSavings > 0)
      .map((t) => ({
        merchant: t.merchant,
        currentAmount: t.amount,
        possibleAmount: t.subscriptionData.lowestTier,
        potentialSaving: t.subscriptionData.potentialSavings,
        currentTier: t.subscriptionData.currentTier,
      }))
      .sort((a, b) => b.potentialSaving - a.potentialSaving);

    return potentialSavings.length > 0 ? potentialSavings[0] : null;
  };

  const potentialDowngrade = findPotentialDowngrades(recurringTransactions);

  // Add date-based analysis
  const dateAnalysis = approvedTransactions.reduce(
    (acc, t) => {
      const date = new Date(t.createdAt);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      acc.byDayOfWeek[dayOfWeek] = (acc.byDayOfWeek[dayOfWeek] || 0) + t.amount;
      acc.byHour[hour] = (acc.byHour[hour] || 0) + t.amount;

      return acc;
    },
    {
      byDayOfWeek: Array(7).fill(0),
      byHour: Array(24).fill(0),
    }
  );

  // Prepare chart data with enhanced context
  const chartData = {
    categoryBreakdown: (() => {
      const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
      return Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, amount]) => ({
          x: category,
          y: Math.round((amount / totalSpending) * 100 * 10) / 10,
        }));
    })(),
    weeklySpending: dateAnalysis.byDayOfWeek.map((amount, index) => ({
      x: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
      y: Math.round(amount * 10) / 10,
    })),
    recurringSpending: Object.entries(recurringByMerchant)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 5)
      .map(([merchant, data]) => ({
        x: merchant,
        y: data.total,
        subscriptionData: data.subscriptionData,
        merchantData: data.merchantData,
      })),
  };

  return {
    merchantFrequency,
    categorySpending,
    mostUsedMerchant,
    highestSpendingCategory,
    recurringTransactions,
    totalRecurringSpend,
    recurringByMerchant,
    dateAnalysis,
    chartData,
    potentialDowngrade,
    storeSpending,
  };
}

async function generateAIInsights(analysis) {
  const prompt = `Analyze this financial data and provide personalized insights. 
You MUST respond with a valid JSON object in the following format:
{
  "overview": ["insight 1", "insight 2"],
  "savings": ["saving tip 1", "saving tip 2"],
  "subscriptionAdvice": ["subscription tip 1", "subscription tip 2"]
}

Here's the data to analyze:

Transaction Data:
- Most frequent merchant: ${analysis.mostUsedMerchant}
- Highest spending category: ${analysis.highestSpendingCategory}
- Total recurring transactions: ${analysis.recurringTransactions.length}
- Monthly recurring spend: KWD ${analysis.totalRecurringSpend.toFixed(2)}

Recurring Transactions:
${Object.entries(analysis.recurringByMerchant)
  .map(([merchant, data]) => `- ${merchant}: KWD ${data.total.toFixed(2)} (${data.count} transactions)`)
  .join('\n')}

Spending Patterns:
- Day of week spending: ${analysis.dateAnalysis.byDayOfWeek
    .map((amount, index) => `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}: KWD ${amount.toFixed(2)}`)
    .join(', ')}

Provide concise, actionable insights about:
1. Key spending patterns (max 15 words per insight)
2. Specific money-saving opportunities based on recurring transactions
3. Subscription and recurring payment optimization ideas

IMPORTANT: 
- Your response must be a valid JSON object with the exact structure shown above
- Each array should contain 2-3 insights
- Keep each insight under 15 words
- Be specific and actionable
- Focus on patterns in the data
- Pay special attention to recurring transactions and potential savings
- Do not include any text outside of the JSON structure
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Try to extract JSON if the response contains other text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Error parsing JSON from match:', parseError);
        return {
          overview: ['Analysis of your spending patterns shows some recurring transactions.'],
          savings: [],
          subscriptionAdvice: [],
        };
      }
    }

    return {
      overview: ['Analysis of your spending patterns shows some recurring transactions.'],
      savings: [],
      subscriptionAdvice: [],
    };
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
}

export function useAIInsights() {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async (transactions) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = analyzeTransactions(transactions);

      // Calculate savings with more context
      const baseSavings = analysis.totalRecurringSpend * 0.1;
      const subscriptionSavings = analysis.potentialDowngrade ? analysis.potentialDowngrade.potentialSaving : 0;
      const totalPotentialSavings = (baseSavings + subscriptionSavings).toFixed(2);

      // Generate insights with store context
      const basicInsights = {
        overview: [
          { title: 'Most Used', value: analysis.mostUsedMerchant },
          { title: 'Top Category', value: analysis.highestSpendingCategory },
          { title: 'Monthly Recurring', value: 'KWD ' + analysis.totalRecurringSpend.toFixed(2) },
        ],
        savings: [
          {
            title: 'Potential Savings',
            value: 'KWD ' + totalPotentialSavings,
            subtitle: analysis.potentialDowngrade
              ? `Save KWD ${analysis.potentialDowngrade.potentialSaving.toFixed(2)} by switching to ${
                  analysis.potentialDowngrade.merchant
                }'s basic plan`
              : `Based on ${analysis.recurringTransactions.length} recurring payments`,
          },
        ],
        subscriptionAdvice: [
          {
            title: 'Active Subscriptions',
            value: analysis.recurringTransactions.length.toString(),
            subtitle: analysis.potentialDowngrade
              ? `Currently on ${analysis.potentialDowngrade.currentTier} plan for ${
                  analysis.potentialDowngrade.merchant
                } (KWD ${analysis.potentialDowngrade.currentAmount.toFixed(2)}/mo)`
              : undefined,
          },
        ],
        chartData: analysis.chartData,
      };

      try {
        // Enhance with AI-generated insights
        const aiInsights = await generateAIInsights(analysis);
        if (aiInsights) {
          // Merge AI insights with basic insights and chart data
          setInsights({
            overview: [
              { title: 'Most Used', value: analysis.mostUsedMerchant },
              { title: 'Top Category', value: analysis.highestSpendingCategory },
              { title: 'Monthly Recurring', value: 'KWD ' + analysis.totalRecurringSpend.toFixed(2) },
            ],
            savings: [
              {
                title: 'Potential Savings',
                value: 'KWD ' + totalPotentialSavings,
                subtitle: analysis.potentialDowngrade
                  ? `Save KWD ${analysis.potentialDowngrade.potentialSaving.toFixed(2)} by switching to ${
                      analysis.potentialDowngrade.merchant
                    }'s basic plan`
                  : `Based on ${analysis.recurringTransactions.length} recurring payments`,
              },
            ],
            subscriptionAdvice: [
              {
                title: 'Active Subscriptions',
                value: analysis.recurringTransactions.length.toString(),
                subtitle: analysis.potentialDowngrade
                  ? `Currently on ${analysis.potentialDowngrade.currentTier} plan for ${
                      analysis.potentialDowngrade.merchant
                    } (KWD ${analysis.potentialDowngrade.currentAmount.toFixed(2)}/mo)`
                  : undefined,
              },
            ],
            chartData: analysis.chartData,
          });
        } else {
          setInsights(basicInsights);
        }
      } catch (aiError) {
        console.error('AI enhancement failed, using basic insights:', aiError);
        setInsights(basicInsights);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    insights,
    isLoading,
    error,
    fetchInsights,
  };
}
