import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUser, updateUser, getCardIssuanceLimit, updateProfilePicture, deleteProfilePicture } from '@/api/user';
import { useAuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { useCallback } from 'react';
import { PLAN_TYPES } from '@/api/plans';

export function useUser() {
  const { user: token, setUser } = useAuthContext();
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

  const { data: issuanceLimit } = useQuery({
    queryKey: ['cardIssuanceLimit'],
    queryFn: getCardIssuanceLimit,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
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

  const updateProfilePictureMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      Toast.show({
        type: 'success',
        text1: 'Profile picture updated successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update profile picture',
      });
    },
  });

  const deleteProfilePictureMutation = useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      Toast.show({
        type: 'success',
        text1: 'Profile picture removed successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to remove profile picture',
      });
    },
  });

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const logout = useCallback(() => {
    // Clear all queries from the cache
    queryClient.clear();
    // Remove the user from context
    setUser(null);
  }, [queryClient, setUser]);

  // Helper functions for plan-related features
  const isPremium = () => user?.plan === PLAN_TYPES.PREMIUM;
  const hasReachedDailyLimit = () => user?.currentDailySpend >= user?.dailySpendLimit;
  const hasReachedMonthlyLimit = () => user?.currentMonthlySpend >= user?.monthlySpendLimit;
  const hasReachedCardIssuanceLimit = () => user?.currentMonthCardIssuance >= user?.monthlyCardIssuanceLimit;

  return {
    user,
    isLoading,
    error,
    refreshUser,
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
    updateProfilePicture: updateProfilePictureMutation.mutateAsync,
    isUpdatingProfilePicture: updateProfilePictureMutation.isPending,
    deleteProfilePicture: deleteProfilePictureMutation.mutateAsync,
    isDeletingProfilePicture: deleteProfilePictureMutation.isPending,
    issuanceLimit,
    logout,
    // Plan-related helpers
    isPremium,
    hasReachedDailyLimit,
    hasReachedMonthlyLimit,
    hasReachedCardIssuanceLimit,
  };
}
