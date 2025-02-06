import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBurnerCard,
  createCategoryCard,
  createMerchantCard,
  createLocationCard,
  updateCardLimit,
  togglePause,
  closeCard,
  updateCard,
} from '@/api/cards';
import Toast from 'react-native-toast-message';

export function useCardMutations() {
  const queryClient = useQueryClient();

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      Toast.show({
        type: 'success',
        text1: data.paused ? 'Card Paused' : 'Card Unpaused',
        text2: data.paused ? 'Card has been paused successfully' : 'Card has been unpaused successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to toggle card pause state',
      });
    },
  });

  const closeCardMutation = useMutation({
    mutationFn: closeCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      Toast.show({
        type: 'success',
        text1: 'Card Closed',
        text2: 'Card has been closed successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to close card',
      });
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
    closeCardMutation,
    updateCardMutation,
  };
}
