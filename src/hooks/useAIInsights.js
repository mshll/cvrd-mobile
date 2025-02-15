import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '@/config/env';

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

  // Analyze recurring transactions
  const recurringTransactions = approvedTransactions
    .filter((t) => t.recurring)
    .map((t) => ({
      merchant: t.merchant,
      amount: t.amount,
      category: t.category,
      date: new Date(t.createdAt),
      type: t.type,
    }));

  // Calculate total recurring spend
  const totalRecurringSpend = recurringTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Group recurring transactions by merchant
  const recurringByMerchant = recurringTransactions.reduce((acc, t) => {
    if (!acc[t.merchant]) {
      acc[t.merchant] = {
        total: 0,
        count: 0,
        category: t.category,
      };
    }
    acc[t.merchant].total += t.amount;
    acc[t.merchant].count++;
    return acc;
  }, {});

  // Add date-based analysis
  const dateAnalysis = approvedTransactions.reduce(
    (acc, t) => {
      const date = new Date(t.createdAt);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      // Track spending by day of week
      acc.byDayOfWeek[dayOfWeek] = (acc.byDayOfWeek[dayOfWeek] || 0) + t.amount;

      // Track spending by hour
      acc.byHour[hour] = (acc.byHour[hour] || 0) + t.amount;

      return acc;
    },
    {
      byDayOfWeek: Array(7).fill(0),
      byHour: Array(24).fill(0),
    }
  );

  // Define common subscription tiers (in KWD)
  const subscriptionTiers = {
    streaming: 2.5, // Basic streaming service tier
    music: 1.5, // Basic music service tier
    storage: 1.0, // Basic cloud storage tier
    fitness: 5.0, // Basic fitness app tier
  };

  // Analyze subscriptions for potential downgrades
  const findPotentialDowngrades = (recurringTransactions) => {
    const highCostSubscriptions = recurringTransactions
      .filter((t) => {
        const monthlyAmount = t.amount;
        // Check if amount exceeds any basic tier by 50% or more
        return Object.values(subscriptionTiers).some((basicAmount) => monthlyAmount > basicAmount * 1.5);
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 1); // Get the highest one

    if (highCostSubscriptions.length > 0) {
      const subscription = highCostSubscriptions[0];
      return {
        merchant: subscription.merchant,
        amount: subscription.amount,
        potentialSaving: (subscription.amount * 0.4).toFixed(2), // Estimate 40% savings from downgrade
      };
    }
    return null;
  };

  const potentialDowngrade = findPotentialDowngrades(recurringTransactions);

  // Prepare chart data
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
      // First, analyze the transactions locally
      const analysis = analyzeTransactions(transactions);

      const savingsValue = analysis.totalRecurringSpend * 0.1;
      const downgradeSavings = analysis.potentialDowngrade
        ? parseFloat(analysis.potentialDowngrade.potentialSaving)
        : 0;
      const totalPotentialSavings = (savingsValue + downgradeSavings).toFixed(2);

      // Generate basic insights
      const basicInsights = {
        overview: [
          { title: 'Most Used', value: analysis.mostUsedMerchant },
          { title: 'Top Category', value: analysis.highestSpendingCategory },
        ],
        savings: [
          {
            title: 'Potential Savings',
            value: 'KWD ' + totalPotentialSavings,
            subtitle: analysis.potentialDowngrade
              ? `Including KWD ${analysis.potentialDowngrade.potentialSaving} from downgrading ${analysis.potentialDowngrade.merchant}`
              : `Based on ${analysis.recurringTransactions.length} recurring payments`,
          },
        ],
        subscriptionAdvice: [
          {
            title: 'Active Subscriptions',
            value: analysis.recurringTransactions.length.toString(),
            subtitle: analysis.potentialDowngrade
              ? `Consider basic tier for ${
                  analysis.potentialDowngrade.merchant
                } (KWD ${analysis.potentialDowngrade.amount.toFixed(2)}/mo)`
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
                  ? `Including KWD ${analysis.potentialDowngrade.potentialSaving} from downgrading ${analysis.potentialDowngrade.merchant}`
                  : `Based on ${analysis.recurringTransactions.length} recurring payments`,
              },
            ],
            subscriptionAdvice: [
              {
                title: 'Active Subscriptions',
                value: analysis.recurringTransactions.length.toString(),
                subtitle: analysis.potentialDowngrade
                  ? `Consider basic tier for ${
                      analysis.potentialDowngrade.merchant
                    } (KWD ${analysis.potentialDowngrade.amount.toFixed(2)}/mo)`
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
