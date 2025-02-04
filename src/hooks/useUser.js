import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUser, updateUser } from '@/api/user';
import { useAuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';

export function useUser() {
  const { user: token } = useAuthContext();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update profile',
      });
    },
  });

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  return {
    user,
    isLoading,
    error,
    refreshUser,
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
  };
}
