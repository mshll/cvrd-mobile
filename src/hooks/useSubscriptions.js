import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserSubscriptions, toggleSubscriptionCard } from '@/api/subscriptions';
import Toast from 'react-native-toast-message';

export const SUBSCRIPTIONS_QUERY_KEY = ['subscriptions'];

export function useSubscriptions() {
  const queryClient = useQueryClient();

  const {
    data: subscriptions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEY,
    queryFn: fetchUserSubscriptions,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: toggleSubscriptionCard,
    onSuccess: () => {
      // Invalidate both subscriptions and cards queries
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Card status updated',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update card status',
      });
    },
  });

  return {
    subscriptions,
    isLoading,
    error,
    refetch,
    toggleSubscription: toggleSubscriptionMutation.mutate,
    isToggling: toggleSubscriptionMutation.isPending,
  };
}
