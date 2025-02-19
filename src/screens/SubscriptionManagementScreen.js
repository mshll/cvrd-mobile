import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Text, YStack, XStack, Button, ScrollView, Spinner } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshControl, Switch } from 'react-native';
import { usePlans } from '@/hooks/usePlans';
import { useState, useCallback } from 'react';
import BottomSheet from '@/components/BottomSheet';
import { formatCurrency } from '@/utils/utils';
import { useNavigation } from '@react-navigation/native';
import {
  SparklesIcon,
  CheckIcon,
  CreditCardIcon,
  MapPinIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import { useUser } from '@/hooks/useUser';

// Add this helper function at the top level
const formatPlanName = (name) => {
  return name.charAt(0) + name.slice(1).toLowerCase();
};

const PlanFeature = ({ text, included }) => {
  const colors = useColors();
  return (
    <XStack ai="center" gap="$3">
      <View
        width={24}
        height={24}
        br={12}
        ai="center"
        jc="center"
        backgroundColor={included ? `${colors.primary}15` : `${colors.textSecondary}15`}
      >
        {included ? (
          <CheckIcon size={16} color={colors.primary} />
        ) : (
          <XMarkIcon size={16} color={colors.textSecondary} />
        )}
      </View>
      <Text color={included ? colors.text : colors.textSecondary} fontSize="$3">
        {text}
      </Text>
    </XStack>
  );
};

const CurrentPlanSummary = ({ plan, remainingDays }) => {
  const colors = useColors();
  const isBasic = plan.name === 'BASIC';

  return (
    <View
      backgroundColor={colors.backgroundSecondary}
      br={16}
      borderWidth={1}
      borderColor={colors.border}
      overflow="hidden"
      mb="$4"
    >
      <YStack p="$4" gap="$3">
        <XStack ai="center" gap="$3">
          <View width={40} height={40} br={12} ai="center" jc="center" backgroundColor={`${colors.primary}15`}>
            <SparklesIcon size={24} color={colors.primary} />
          </View>
          <YStack>
            <Text color={colors.text} fontSize="$5" fontWeight="700">
              {formatPlanName(plan.name)} Plan
            </Text>
            <Text color={colors.textSecondary} fontSize="$3">
              {isBasic ? 'Free Forever' : `KD ${plan.price}/month`}
            </Text>
          </YStack>
        </XStack>
        {!isBasic && remainingDays && (
          <View
            backgroundColor={`${colors.backgroundTertiary}80`}
            p="$3"
            br={8}
            borderWidth={0}
            borderColor={colors.border}
          >
            <Text color={colors.textSecondary} fontSize="$3">
              Your subscription will {plan.autoRenewal ? 'renew' : 'end'} in {remainingDays} days
            </Text>
          </View>
        )}
      </YStack>
    </View>
  );
};

const PlanCard = ({ plan, isActive, onSelect }) => {
  const colors = useColors();
  const isBasic = plan.name === 'BASIC';
  const { user } = useUser();
  const hasBankAccount = !!user?.bankAccountNumber;
  const isUpgrade = plan.name === 'PREMIUM';

  const showConnectBankWarning = isUpgrade && !hasBankAccount;

  return (
    <View
      backgroundColor={colors.backgroundSecondary}
      br={16}
      borderWidth={2}
      borderColor={isActive ? colors.primary : colors.border}
      overflow="hidden"
      mb="$4"
    >
      <YStack p="$4" gap="$4">
        {/* Header */}
        <XStack jc="space-between" ai="center">
          <YStack>
            <Text color={colors.text} fontSize="$5" fontWeight="700">
              {formatPlanName(plan.name)}
            </Text>
            <Text color={colors.textSecondary} fontSize="$3">
              {isBasic ? 'Free Forever' : `KD ${plan.price}/month`}
            </Text>
          </YStack>
          {isActive ? (
            <View
              backgroundColor={`${colors.primary}15`}
              px="$3"
              py="$1"
              br={20}
              borderWidth={1}
              borderColor={`${colors.primary}30`}
            >
              <Text color={colors.primary} fontSize="$2" fontWeight="600">
                CURRENT PLAN
              </Text>
            </View>
          ) : (
            <Button
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={() => onSelect(plan)}
              size="$3"
              br={8}
              disabled={showConnectBankWarning}
              opacity={showConnectBankWarning ? 0.5 : 1}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                {isBasic ? 'Downgrade' : 'Upgrade'}
              </Text>
            </Button>
          )}
        </XStack>

        {/* Bank Account Warning */}
        {showConnectBankWarning && (
          <View backgroundColor={`${colors.danger}10`} p="$3" br={8} borderWidth={1} borderColor={`${colors.danger}30`}>
            <XStack ai="center" gap="$2">
              <Text color={colors.danger} fontSize="$3" fontWeight="500">
                Connect your bank account to upgrade
              </Text>
            </XStack>
          </View>
        )}

        {/* Features */}
        <YStack gap="$3" mt="$2">
          <PlanFeature text={`Monthly Spend Limit: ${formatCurrency(plan.monthlySpendLimit)}`} included={true} />
          <PlanFeature text={`Daily Spend Limit: ${formatCurrency(plan.dailySpendLimit)}`} included={true} />
          <PlanFeature text={`${plan.monthlyCardIssuanceLimit} Cards per Month`} included={true} />
          <PlanFeature text="Merchant-Locked Cards" included={plan.hasMerchantLocking} />
          <PlanFeature text="Category-Locked Cards" included={plan.hasCategoryLocking} />
          <PlanFeature text="Location-Locked Cards" included={plan.hasLocationLocking} />
        </YStack>
      </YStack>
    </View>
  );
};

const ConfirmationSheet = ({ isOpen, onClose, plan, isUpgrade, onConfirm, isLoading }) => {
  const colors = useColors();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <YStack gap="$4" px="$4" pt="$2" pb="$6">
        <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
          {isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
        </Text>
        <Text color={colors.textSecondary} fontSize="$4">
          {isUpgrade
            ? 'Are you sure you want to upgrade to the Premium plan? You will be charged KD 5.00 monthly.'
            : 'Are you sure you want to downgrade to the Basic plan? You will lose access to premium features at the end of your current billing period.'}
        </Text>
        <YStack gap="$3">
          <Button
            backgroundColor={isUpgrade ? colors.primary : `${colors.danger}10`}
            pressStyle={{ backgroundColor: isUpgrade ? colors.primaryDark : `${colors.danger}20` }}
            onPress={onConfirm}
            size="$5"
            borderRadius={12}
            borderWidth={1}
            borderColor={isUpgrade ? colors.primary : `${colors.danger}30`}
            disabled={isLoading}
          >
            <Text color={isUpgrade ? 'white' : colors.danger} fontSize="$4" fontWeight="600">
              {isLoading
                ? isUpgrade
                  ? 'Upgrading...'
                  : 'Downgrading...'
                : isUpgrade
                ? 'Confirm Upgrade'
                : 'Confirm Downgrade'}
            </Text>
          </Button>
          <Button
            backgroundColor={colors.backgroundSecondary}
            pressStyle={{ backgroundColor: colors.backgroundTertiary }}
            onPress={onClose}
            size="$5"
            borderRadius={12}
            borderWidth={1}
            borderColor={colors.border}
          >
            <Text color={colors.text} fontSize="$4" fontWeight="600">
              Cancel
            </Text>
          </Button>
        </YStack>
      </YStack>
    </BottomSheet>
  );
};

const SubscriptionManagementScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    plans,
    currentPlan,
    remainingDays,
    autoRenewal,
    isPlansLoading,
    upgradePlan,
    isUpgrading,
    downgradePlan,
    isDowngrading,
    toggleAutoRenewal,
    isTogglingAutoRenewal,
    refreshPlans,
  } = usePlans();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshPlans();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshPlans]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;

    const isUpgrade = selectedPlan.name === 'PREMIUM';
    try {
      if (isUpgrade) {
        await upgradePlan(selectedPlan.name);
      } else {
        await downgradePlan(selectedPlan.name);
      }
      setShowConfirmation(false);
    } catch (error) {
      console.log('Error changing plan:', error);
    }
  };

  if (isPlansLoading) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Spinner size="large" color={colors.primary} />
      </View>
    );
  }

  const isUpgrade = selectedPlan?.name === 'PREMIUM';
  const currentPlanData = plans.find((p) => p.name === currentPlan);

  return (
    <View f={1} bg={colors.background} pt={insets.top}>
      {/* Header */}
      <View
        backgroundColor={colors.background}
        style={{
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: `${colors.border}40`,
        }}
      >
        <XStack ai="center" jc="space-between" px="$4" pt="$2">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack" fontWeight="900">
            Manage Your Plan
          </Text>
          <Button
            size="$3"
            circular
            backgroundColor={colors.backgroundSecondary}
            pressStyle={{ backgroundColor: colors.backgroundTertiary }}
            onPress={() => navigation.goBack()}
            borderWidth={1}
            borderColor={colors.border}
          >
            <XMarkIcon size={20} color={colors.text} />
          </Button>
        </XStack>
      </View>

      <ScrollView
        f={1}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.text}
            colors={[colors.primary]}
            progressBackgroundColor={colors.backgroundSecondary}
          />
        }
      >
        {/* Current Plan Summary */}
        {currentPlanData && (
          <CurrentPlanSummary plan={{ ...currentPlanData, autoRenewal }} remainingDays={remainingDays} />
        )}

        {/* Auto-Renewal Toggle for Premium */}
        {currentPlan === 'PREMIUM' && (
          <View
            backgroundColor={colors.backgroundSecondary}
            p="$4"
            br={12}
            borderWidth={1}
            borderColor={colors.border}
            mb="$6"
          >
            <XStack jc="space-between" ai="center">
              <YStack>
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  Auto-Renewal
                </Text>
                <Text color={colors.textSecondary} fontSize="$3">
                  {autoRenewal ? 'Your plan will automatically renew' : 'Your plan will end after current period'}
                </Text>
              </YStack>
              <Switch
                value={autoRenewal}
                onValueChange={toggleAutoRenewal}
                disabled={isTogglingAutoRenewal}
                trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
                thumbColor={colors.background}
                ios_backgroundColor={colors.backgroundTertiary}
              />
            </XStack>
          </View>
        )}

        {/* Available Plans Section */}
        <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" mb="$4">
          Available Plans
        </Text>

        {/* Plan Cards */}
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} isActive={plan.name === currentPlan} onSelect={handlePlanSelect} />
        ))}
      </ScrollView>

      <ConfirmationSheet
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        plan={selectedPlan}
        isUpgrade={isUpgrade}
        onConfirm={handleConfirm}
        isLoading={isUpgrade ? isUpgrading : isDowngrading}
      />
    </View>
  );
};

export default SubscriptionManagementScreen;
