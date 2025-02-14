import { useQuery } from '@tanstack/react-query';
import { fetchUserTransactions, fetchCardTransactions } from '@/api/transactions';

export const TRANSACTIONS_QUERY_KEY = ['transactions'];

export function useTransactions(cardId = null) {
  const queryKey = cardId ? [...TRANSACTIONS_QUERY_KEY, cardId] : TRANSACTIONS_QUERY_KEY;
  const queryFn = cardId ? () => fetchCardTransactions(cardId) : fetchUserTransactions;

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });
}
