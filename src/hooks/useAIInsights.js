import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '@/config/env';
import { stores } from '@/data/stores2';
import { subscriptions } from '@/data/subscriptions';
import { MERCHANTS } from '@/data/merchants';
import { getCardById } from '@/api/cards';

// Initialize Gemini AI
if (!ENV.GEMINI_API_KEY) {
  console.error('Gemini API key is missing. Please check your environment configuration.');
}
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function analyzeTransactions(transactions) {
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

  // Analyze recurring transactions with subscription data, checking card status
  const recurringTransactions = await Promise.all(
    approvedTransactions
      .filter((t) => t.recurring)
      .map(async (t) => {
        // Get card status
        try {
          const card = await getCardById(t.cardId);
          if (card.closed || card.paused) {
            return null;
          }
        } catch (error) {
          console.error('Error fetching card:', error);
          return null;
        }

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
                currentTier:
                  subscriptionService.plans.find((p) => Math.abs(p.price - t.amount) < 0.5)?.name || 'Unknown',
                potentialSavings: t.amount - Math.min(...subscriptionService.plans.map((p) => p.price)),
                plans: subscriptionService.plans,
              }
            : null,
          merchantData: merchant || null,
        };
      })
  ).then((results) => results.filter(Boolean));

  // Calculate total recurring spend (only active subscriptions)
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
  // Helper function to find similar items
  function findSimilarItems(items) {
    const categories = {};

    // Group items by similar categories and features
    items.forEach((item) => {
      const keywords = [...item.name.toLowerCase().split(' '), ...item.category.toLowerCase().split(' ')];

      // Find or create matching category
      let matchingCategory = Object.keys(categories).find((cat) =>
        keywords.some((kw) => cat.includes(kw) || kw.includes(cat))
      );

      if (!matchingCategory) {
        matchingCategory = item.category.toLowerCase();
      }

      if (!categories[matchingCategory]) {
        categories[matchingCategory] = [];
      }

      categories[matchingCategory].push({
        ...item,
        keywords,
      });
    });

    // Find price differences within categories
    return Object.entries(categories)
      .map(([category, items]) => {
        const sortedByPrice = [...items].sort((a, b) => a.price - b.price);
        const cheapest = sortedByPrice[0];
        const mostExpensive = sortedByPrice[sortedByPrice.length - 1];
        const priceDiff = mostExpensive.price - cheapest.price;

        return {
          category,
          items: sortedByPrice,
          potentialSavings: priceDiff,
          cheapestOption: {
            store: cheapest.storeName,
            item: cheapest.name,
            price: cheapest.price,
          },
          expensiveOption: {
            store: mostExpensive.storeName,
            item: mostExpensive.name,
            price: mostExpensive.price,
          },
        };
      })
      .sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  // Create store comparison data with flattened items
  const allItems = stores.flatMap((store) =>
    store.items.map((item) => ({
      storeName: store.name,
      storeCategory: store.category,
      ...item,
    }))
  );

  // Find similar items and potential savings
  const itemComparisons = findSimilarItems(allItems);

  // Analyze subscription bundles and alternatives
  const streamingServices = subscriptions
    .filter((sub) => sub.category === 'Entertainment')
    .map((sub) => ({
      name: sub.name,
      lowestPrice: Math.min(...sub.plans.map((p) => p.price)),
      bestValue: sub.plans.reduce((best, plan) =>
        plan.features.length / plan.price > best.features.length / best.price ? plan : best
      ),
      plans: sub.plans,
    }))
    .sort((a, b) => a.lowestPrice - b.lowestPrice);

  const prompt = `Analyze the user's transaction history and provide personalized savings recommendations.
If specific savings amounts cannot be calculated, provide general optimization advice based on shopping patterns.

User's Current Shopping Patterns:
${Object.entries(analysis.storeSpending)
  .map(
    ([store, data]) => `
- ${store}:
  • Total spent: KWD ${data.total.toFixed(2)}
  • Number of visits: ${data.count}
  • Average transaction: KWD ${(data.total / data.count).toFixed(2)}
  • Store category: ${data.category}`
  )
  .join('\n')}

Most frequently visited stores for each category:
${Object.entries(analysis.categorySpending)
  .sort(([, a], [, b]) => b - a)
  .map(([category, amount]) => {
    const storesInCategory = Object.entries(analysis.storeSpending)
      .filter(([, data]) => data.category === category)
      .sort(([, a], [, b]) => b.total - a.total);
    return `
- ${category} (Total: KWD ${amount.toFixed(2)}):
  ${storesInCategory
    .map(([store, data]) => `• ${store}: KWD ${data.total.toFixed(2)} (${data.count} visits)`)
    .join('\n  ')}`;
  })
  .join('\n')}

Current Subscriptions Analysis:
${Object.entries(analysis.recurringByMerchant)
  .map(
    ([merchant, data]) => `
- ${merchant}:
  • Monthly cost: KWD ${data.total.toFixed(2)}
  • Current tier: ${data.subscriptionData?.currentTier || 'Unknown'}
  • Lowest available tier: KWD ${data.subscriptionData?.lowestTier?.toFixed(2) || 'Unknown'}
  • Potential monthly savings: KWD ${data.subscriptionData?.potentialSavings?.toFixed(2) || '0'}`
  )
  .join('\n')}

Based on this transaction history, generate exactly 3 highly personalized recommendations for each section.
For recommendations where specific savings cannot be calculated:
- Focus on behavioral changes and shopping strategies
- Suggest specific stores to compare prices
- Recommend timing of purchases based on patterns
- Suggest subscription plan optimizations without specific amounts

Respond in this JSON format:
{
  "savings": [
    {
      "title": "Store Comparison",
      "value": ${
        analysis.storeSpending && Object.keys(analysis.storeSpending).length > 0
          ? '"Potential Savings: KWD X"'
          : '"Price Comparison"'
      },
      "subtitle": "Specific recommendation based on actual shopping patterns"
    },
    {
      "title": "Subscription Optimization",
      "value": ${
        analysis.recurringByMerchant && Object.keys(analysis.recurringByMerchant).length > 0
          ? '"Monthly Savings: KWD X"'
          : '"Plan Optimization"'
      },
      "subtitle": "Specific recommendation based on current subscriptions"
    },
    {
      "title": "Shopping Pattern",
      "value": ${analysis.dateAnalysis ? '"Estimated Savings: KWD X"' : '"Smart Shopping"'},
      "subtitle": "Specific recommendation based on transaction timing and frequency"
    }
  ],
  "subscriptionAdvice": [
    {
      "title": "Current Service Optimization",
      "value": ${
        analysis.recurringByMerchant && Object.keys(analysis.recurringByMerchant).length > 0
          ? '"Service-specific recommendation with savings"'
          : '"Service Optimization"'
      },
      "subtitle": "Based on actual usage and available plans"
    },
    {
      "title": "Bundle Opportunity",
      "value": ${streamingServices.length > 1 ? '"Specific services to bundle with savings"' : '"Bundle Services"'},
      "subtitle": "Actual cost comparison with bundle savings"
    },
    {
      "title": "Alternative Service",
      "value": ${
        analysis.recurringByMerchant && Object.keys(analysis.recurringByMerchant).length > 0
          ? '"Specific alternative with savings"'
          : '"Service Alternatives"'
      },
      "subtitle": "Based on current service usage patterns"
    }
  ]
}`;

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
        return null;
      }
    }
    return null;
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
      // First, calculate all the basic insights
      const analysis = await analyzeTransactions(transactions);

      // Calculate savings with more context
      const baseSavings = analysis.totalRecurringSpend * 0.1;
      const subscriptionSavings = analysis.potentialDowngrade ? analysis.potentialDowngrade.potentialSaving : 0;
      const totalPotentialSavings = (baseSavings + subscriptionSavings).toFixed(2);

      // Count total recurring transactions including paused/closed
      const allRecurringCount = transactions.filter((t) => t.recurring && t.status === 'APPROVED').length;
      const activeRecurringCount = analysis.recurringTransactions.length;

      // Set up basic calculated insights
      const calculatedInsights = {
        overview: [
          { title: 'Most Used', value: analysis.mostUsedMerchant },
          { title: 'Top Category', value: analysis.highestSpendingCategory },
          { title: 'Monthly Recurring', value: 'KWD ' + analysis.totalRecurringSpend.toFixed(2) },
        ],
        chartData: analysis.chartData,
        subscriptionSummary: {
          title: 'Active Subscriptions',
          value: activeRecurringCount.toString(),
          subtitle:
            allRecurringCount > activeRecurringCount
              ? `${allRecurringCount - activeRecurringCount} subscriptions currently paused or closed`
              : 'All subscriptions active',
        },
      };

      try {
        // Generate AI recommendations
        const aiRecommendations = await generateAIInsights(analysis);

        // Merge calculated insights with AI recommendations
        setInsights({
          ...calculatedInsights,
          savings: [
            totalPotentialSavings > 0
              ? {
                  title: 'Potential Monthly Savings',
                  value: 'KWD ' + totalPotentialSavings,
                  subtitle: `Based on ${activeRecurringCount} active subscriptions and spending patterns`,
                }
              : {
                  title: 'Savings Opportunities',
                  value: 'Smart Recommendations',
                  subtitle: 'Personalized suggestions to optimize your spending',
                },
            ...(aiRecommendations?.savings || []).slice(0, 2),
          ].slice(0, 3),
          subscriptionAdvice: (aiRecommendations?.subscriptionAdvice || []).slice(0, 3),
          overview: calculatedInsights.overview.slice(0, 3),
        });
      } catch (aiError) {
        console.error('AI recommendations failed:', aiError);
        // Still return basic insights even if AI fails
        setInsights(calculatedInsights);
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
