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
    select: (data) => {
      // Transform API response to match frontend needs
      return data.map((transaction) => ({
        id: transaction.id.toString(),
        name: transaction.merchant,
        amount: transaction.amount,
        status: transaction.status,
        date: transaction.createdAt,
        type: transaction.type,
        category: transaction.category,
        isRecurring: transaction.isRecurring || false,
        latitude: transaction.latitude,
        longitude: transaction.longitude,
        declineReason: transaction.declineReason,
        cardId: transaction.cardId,
        merchant: transaction.merchant,
      }));
    },
  });
}
