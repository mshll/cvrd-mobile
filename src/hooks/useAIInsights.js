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
  // Group transactions by merchant
  const merchantFrequency = transactions.reduce((acc, t) => {
    acc[t.merchant] = (acc[t.merchant] || 0) + 1;
    return acc;
  }, {});

  // Group transactions by category
  const categorySpending = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  // Find most used merchant
  const mostUsedMerchant = Object.entries(merchantFrequency).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  // Find highest spending category
  const highestSpendingCategory = Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  // Parse subscription data
  const subscriptions = transactions
    .filter((t) => t.type === 'SUBSCRIPTION')
    .map((t) => {
      try {
        const details = JSON.parse(t.description);
        return {
          merchant: details.merchant.name,
          plan: details.subscription.plan,
          price: details.subscription.price,
          billingCycle: details.subscription.billingCycle,
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  // Parse store purchases
  const storePurchases = transactions
    .filter((t) => t.type === 'STORE_PURCHASE')
    .map((t) => {
      try {
        const details = JSON.parse(t.description);
        return {
          merchant: details.merchant.name,
          category: details.merchant.category,
          items: details.items,
          total: details.payment.total,
          location: details.merchant.location,
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  // Add date-based analysis
  const dateAnalysis = transactions.reduce(
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

  return {
    merchantFrequency,
    categorySpending,
    mostUsedMerchant,
    highestSpendingCategory,
    subscriptions,
    storePurchases,
    dateAnalysis,
  };
}

async function generateAIInsights(analysis) {
  const prompt = `Analyze this financial data and provide personalized insights and recommendations. 
You MUST respond with a valid JSON object in the following format:
{
  "overview": ["insight 1", "insight 2"],
  "savings": ["saving tip 1", "saving tip 2"],
  "subscriptionAdvice": ["subscription tip 1", "subscription tip 2"],
  "shoppingTips": ["shopping tip 1", "shopping tip 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Here's the data to analyze:

Transaction Data:
- Most frequent merchant: ${analysis.mostUsedMerchant}
- Highest spending category: ${analysis.highestSpendingCategory}
- Total subscriptions: ${analysis.subscriptions.length}
- Total store purchases: ${analysis.storePurchases.length}

Spending Patterns:
- Day of week spending: ${analysis.dateAnalysis.byDayOfWeek
    .map((amount, index) => `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}: KWD ${amount.toFixed(2)}`)
    .join(', ')}
- Hourly spending patterns: ${analysis.dateAnalysis.byHour
    .map((amount, hour) => (amount > 0 ? `${hour}:00: KWD ${amount.toFixed(2)}` : ''))
    .filter(Boolean)
    .join(', ')}

Subscription Details:
${analysis.subscriptions
  .map((sub) => `- ${sub.merchant}: ${sub.plan} (${sub.billingCycle}) at KWD ${sub.price}`)
  .join('\n')}

Store Purchase Analysis:
${analysis.storePurchases
  .map((purchase) => `- ${purchase.merchant} (${purchase.category}): KWD ${purchase.total}`)
  .join('\n')}

Provide specific insights about:
1. Spending patterns and trends in the overview
2. Money-saving opportunities based on timing and location
3. Subscription optimization suggestions
4. Shopping tips based on the user's patterns
5. General financial management recommendations

IMPORTANT: Your response must be a valid JSON object with the exact structure shown above.
Each array should contain 2-4 clear, actionable insights.
Do not include any text outside of the JSON structure.`;

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
        // Return a fallback structured response
        return {
          overview: [text.slice(0, 200) + '...'],
          savings: [],
          subscriptionAdvice: [],
          shoppingTips: [],
          recommendations: [],
        };
      }
    }

    // If no JSON found, structure the raw text into our format
    return {
      overview: [text.slice(0, 200) + '...'],
      savings: [],
      subscriptionAdvice: [],
      shoppingTips: [],
      recommendations: [],
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

      // Generate basic insights
      const basicInsights = {
        overview: [
          `Most frequent merchant: ${analysis.mostUsedMerchant}`,
          `Highest spending category: ${analysis.highestSpendingCategory}`,
        ],
        savings: [],
        subscriptionAdvice: [],
        shoppingTips: [],
        recommendations: [],
      };

      // Add local analysis insights
      if (analysis.subscriptions.length > 0) {
        const totalSubscriptionCost = analysis.subscriptions.reduce((sum, sub) => sum + sub.price, 0);
        basicInsights.subscriptionAdvice.push(
          `You have ${analysis.subscriptions.length} active subscriptions totaling KWD ${totalSubscriptionCost.toFixed(
            2
          )} per month`
        );
      }

      try {
        // Enhance with AI-generated insights
        const aiInsights = await generateAIInsights(analysis);
        if (aiInsights) {
          // Merge AI insights with basic insights, prioritizing AI insights
          setInsights({
            overview: [...new Set([...aiInsights.overview, ...basicInsights.overview])],
            savings: aiInsights.savings,
            subscriptionAdvice: [...new Set([...aiInsights.subscriptionAdvice, ...basicInsights.subscriptionAdvice])],
            shoppingTips: aiInsights.shoppingTips,
            recommendations: aiInsights.recommendations,
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
