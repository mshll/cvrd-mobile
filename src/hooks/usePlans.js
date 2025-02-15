import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlans, upgradePlan, downgradePlan, toggleAutoRenewal, PLAN_TYPES } from '@/api/plans';
import { useUser } from './useUser';
import Toast from 'react-native-toast-message';

export function usePlans() {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useUser();

  // Fetch available plans
  const {
    data: plans = [],
    isLoading: isPlansLoading,
    error: plansError,
  } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Upgrade plan mutation
  const upgradePlanMutation = useMutation({
    mutationFn: upgradePlan,
    onSuccess: async (data) => {
      await refreshUser();
      Toast.show({
        type: 'success',
        text1: 'Plan Upgraded',
        text2: 'Your subscription has been upgraded successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Upgrade Failed',
        text2: error.response?.data?.message || 'Failed to upgrade plan',
      });
    },
  });

  // Downgrade plan mutation
  const downgradePlanMutation = useMutation({
    mutationFn: downgradePlan,
    onSuccess: async (data) => {
      await refreshUser();
      Toast.show({
        type: 'success',
        text1: 'Plan Changed',
        text2: 'Your plan will be downgraded at the end of the billing period',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Downgrade Failed',
        text2: error.response?.data?.message || 'Failed to downgrade plan',
      });
    },
  });

  // Toggle auto-renewal mutation
  const toggleAutoRenewalMutation = useMutation({
    mutationFn: toggleAutoRenewal,
    onSuccess: async (data) => {
      await refreshUser();
      Toast.show({
        type: 'success',
        text1: 'Auto-Renewal Updated',
        text2: `Auto-renewal has been ${data.autoRenewal ? 'enabled' : 'disabled'}`,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.response?.data?.message || 'Failed to update auto-renewal',
      });
    },
  });

  // Helper functions
  const getCurrentPlan = () => {
    return user?.plan || PLAN_TYPES.BASIC;
  };

  const getCurrentPlanLimits = () => {
    const currentPlanName = getCurrentPlan();
    return plans.find((plan) => plan.name === currentPlanName);
  };

  const canUpgradeToPremium = () => {
    return getCurrentPlan() === PLAN_TYPES.BASIC && user?.bankAccountNumber;
  };

  const getRemainingDays = () => {
    if (!user?.planEndDate) return null;
    const endDate = new Date(user.planEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPlanByName = (planName) => {
    return plans.find((plan) => plan.name === planName);
  };

  const getUsagePercentage = (type) => {
    switch (type) {
      case 'daily':
        return (user?.currentDailySpend / user?.dailySpendLimit) * 100 || 0;
      case 'monthly':
        return (user?.currentMonthlySpend / user?.monthlySpendLimit) * 100 || 0;
      case 'cards':
        return (user?.currentMonthCardIssuance / user?.monthlyCardIssuanceLimit) * 100 || 0;
      default:
        return 0;
    }
  };

  return {
    // Data
    plans,
    isPlansLoading,
    plansError,
    currentPlan: getCurrentPlan(),
    currentPlanLimits: getCurrentPlanLimits(),
    remainingDays: getRemainingDays(),

    // Usage data
    dailySpendLimit: user?.dailySpendLimit,
    monthlySpendLimit: user?.monthlySpendLimit,
    cardIssuanceLimit: user?.monthlyCardIssuanceLimit,
    currentDailySpend: user?.currentDailySpend,
    currentMonthlySpend: user?.currentMonthlySpend,
    currentCardIssuance: user?.currentMonthCardIssuance,
    autoRenewal: user?.autoRenewal,

    // Mutations
    upgradePlan: upgradePlanMutation.mutateAsync,
    isUpgrading: upgradePlanMutation.isPending,
    downgradePlan: downgradePlanMutation.mutateAsync,
    isDowngrading: downgradePlanMutation.isPending,
    toggleAutoRenewal: toggleAutoRenewalMutation.mutateAsync,
    isTogglingAutoRenewal: toggleAutoRenewalMutation.isPending,

    // Helper functions
    canUpgradeToPremium,
    getPlanByName,
    getUsagePercentage,
  };
}
