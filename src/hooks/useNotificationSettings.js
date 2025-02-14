import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleNotifications } from '@/api/notifications';
import Toast from 'react-native-toast-message';

export function useNotificationSettings() {
  const queryClient = useQueryClient();

  const toggleNotificationsMutation = useMutation({
    mutationFn: toggleNotifications,
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user'] });

      // Get current user data
      const previousUser = queryClient.getQueryData(['user']);

      // Optimistically update the user data
      queryClient.setQueryData(['user'], (old) => ({
        ...old,
        notificationEnabled: !old.notificationEnabled,
      }));

      return { previousUser };
    },
    onError: (err, _, context) => {
      // Revert optimistic update on error
      queryClient.setQueryData(['user'], context.previousUser);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Failed to update notification settings',
      });
    },
    onSuccess: (newState) => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Notifications ${newState ? 'enabled' : 'disabled'} successfully`,
      });
    },
    onSettled: () => {
      // Refetch user data to ensure it's in sync
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    toggleNotifications: toggleNotificationsMutation.mutate,
    isToggling: toggleNotificationsMutation.isPending,
  };
}
