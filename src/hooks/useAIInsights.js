import { useState } from 'react';
import instance from '@/api';

export function useAIInsights() {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get('/ai/analyze');
      setInsights(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching AI insights:', err);
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
