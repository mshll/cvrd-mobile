import { useQuery } from '@tanstack/react-query';
import { fetchUserCards } from '@/api/cards';

export const CARDS_QUERY_KEY = ['cards'];

export function useCardsQuery() {
  return useQuery({
    queryKey: CARDS_QUERY_KEY,
    queryFn: fetchUserCards,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when reconnecting
    retry: 3, // Retry failed requests 3 times
    onSuccess: (data) => {
      console.log('🎯 Query succeeded, cards in cache:', data?.length || 0);
    },
    onError: (error) => {
      console.log('💥 Query failed:', error.message);
    },
  });
}
