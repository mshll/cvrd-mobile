import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBurnerCard, createCategoryCard, createMerchantCard, createLocationCard } from '@/api/cards';
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

  return {
    createBurnerCardMutation,
    createCategoryCardMutation,
    createMerchantCardMutation,
    createLocationCardMutation,
  };
}
