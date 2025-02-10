import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBurnerCard,
  createCategoryCard,
  createMerchantCard,
  createLocationCard,
  updateCardLimit,
  togglePause,
  togglePin,
  closeCard,
  updateCard,
} from '@/api/cards';
import { CARDS_QUERY_KEY } from './useCardsQuery';
import Toast from 'react-native-toast-message';

export function useCardMutations() {
  const queryClient = useQueryClient();

  // Optimistic update helper
  const optimisticUpdate = (cardId, updates) => {
    queryClient.setQueryData(CARDS_QUERY_KEY, (old) => {
      if (!old) return old;
      return old.map((card) => (card.id === cardId ? { ...card, ...updates } : card));
    });
  };

  // Helper function to create mutation options
  const createMutationOptions = (successMessage) => ({
    onSuccess: (data) => {
      // Invalidate and refetch cards queries
      queryClient.invalidateQueries({ queryKey: ['cards'] });

      Toast.show({
        type: 'success',
        text1: 'Card Created',
        text2: successMessage,
      });
    },
    onError: (error) => {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to create card',
      });
    },
  });

  const updateCardLimitMutation = useMutation({
    mutationFn: ({ cardId, limitType, amount }) => updateCardLimit(cardId, limitType, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      Toast.show({
        type: 'success',
        text1: 'Limit Updated',
        text2: 'Card limit has been updated successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update card limit',
      });
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: togglePause,
    onMutate: async (cardId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: CARDS_QUERY_KEY });

      // Get current cards
      const previousCards = queryClient.getQueryData(CARDS_QUERY_KEY);

      // Optimistically update
      optimisticUpdate(cardId, { paused: !previousCards?.find((c) => c.id === cardId)?.paused });

      return { previousCards };
    },
    onError: (err, cardId, context) => {
      // Revert optimistic update on error
      queryClient.setQueryData(CARDS_QUERY_KEY, context.previousCards);
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Failed to toggle pause',
      });
    },
    onSuccess: (data, cardId) => {
      Toast.show({
        type: 'success',
        text1: `Card ${data.paused ? 'paused' : 'unpaused'} successfully`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CARDS_QUERY_KEY });
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: togglePin,
    onMutate: async (cardId) => {
      await queryClient.cancelQueries({ queryKey: CARDS_QUERY_KEY });
      const previousCards = queryClient.getQueryData(CARDS_QUERY_KEY);
      optimisticUpdate(cardId, { pinned: !previousCards?.find((c) => c.id === cardId)?.pinned });
      return { previousCards };
    },
    onError: (err, cardId, context) => {
      queryClient.setQueryData(CARDS_QUERY_KEY, context.previousCards);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Failed to toggle pin',
      });
    },
    onSuccess: (data, cardId) => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Card ${data.pinned ? 'pinned' : 'unpinned'} successfully`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CARDS_QUERY_KEY });
    },
  });

  const closeCardMutation = useMutation({
    mutationFn: closeCard,
    onMutate: async (cardId) => {
      await queryClient.cancelQueries({ queryKey: CARDS_QUERY_KEY });
      const previousCards = queryClient.getQueryData(CARDS_QUERY_KEY);
      optimisticUpdate(cardId, { closed: true });
      return { previousCards };
    },
    onError: (err, cardId, context) => {
      queryClient.setQueryData(CARDS_QUERY_KEY, context.previousCards);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Failed to close card',
      });
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Card closed successfully',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CARDS_QUERY_KEY });
    },
  });

  const createBurnerCardMutation = useMutation({
    mutationFn: createBurnerCard,
    ...createMutationOptions('Your burner card has been created successfully'),
  });

  const createCategoryCardMutation = useMutation({
    mutationFn: createCategoryCard,
    ...createMutationOptions('Your category-locked card has been created successfully'),
  });

  const createMerchantCardMutation = useMutation({
    mutationFn: createMerchantCard,
    ...createMutationOptions('Your merchant-locked card has been created successfully'),
  });

  const createLocationCardMutation = useMutation({
    mutationFn: createLocationCard,
    ...createMutationOptions('Your location-locked card has been created successfully'),
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, updates }) => updateCard(cardId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      Toast.show({
        type: 'success',
        text1: 'Card Updated',
        text2: 'Card has been updated successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update card',
      });
    },
  });

  return {
    createBurnerCardMutation,
    createCategoryCardMutation,
    createMerchantCardMutation,
    createLocationCardMutation,
    updateCardLimitMutation,
    togglePauseMutation,
    togglePinMutation,
    closeCardMutation,
    updateCardMutation,
  };
}
