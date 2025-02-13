import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Text, YStack, XStack, Button, Avatar, ScrollView, Circle, Spinner } from 'tamagui';
import { useUser } from '@/hooks/useUser';
import { useCards } from '@/hooks/useCards';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '@/utils/utils';
import { StyleSheet, Image, RefreshControl } from 'react-native';
import {
  BellIcon,
  CreditCardIcon,
  UserIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  PowerIcon,
  ChevronRightIcon,
  ShareIcon,
  BanknotesIcon,
  ClockIcon,
  BuildingLibraryIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { UserIcon as UserIconFilled } from 'react-native-heroicons/solid';
import { useState, useCallback } from 'react';
import BottomSheet from '@/components/BottomSheet';
import { Paths } from '@/navigation/paths';
import { deleteToken } from '@/api/storage';
import { useAuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { disconnectBank } from '@/api/user';

const MenuItem = ({ icon: Icon, label, value, onPress, showArrow = true }) => {
  const colors = useColors();
  return (
    <Button
      height={60}
      backgroundColor={colors.backgroundSecondary}
      pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.98 }}
      onPress={onPress}
      px="$4"
      mx="$4"
      borderRadius={12}
      borderWidth={1}
      borderColor={colors.border}
      animation="quick"
    >
      <XStack ai="center" jc="space-between" f={1}>
        <XStack ai="center" gap="$3">
          <View backgroundColor={`${colors.backgroundTertiary}80`} p="$2" borderRadius={8}>
            <Icon size={20} color={colors.text} />
          </View>
          <Text color={colors.text} fontSize="$4" fontWeight="500">
            {label}
          </Text>
        </XStack>
        <XStack ai="center" gap="$2">
          {value && (
            <Text color={colors.textSecondary} fontSize="$3">
              {value}
            </Text>
          )}
          {showArrow && <ChevronRightIcon size={16} color={colors.textSecondary} />}
        </XStack>
      </XStack>
    </Button>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = useColors();
  return (
    <View
      f={1}
      backgroundColor={colors.backgroundSecondary}
      borderRadius={12}
      p="$4"
      borderWidth={1}
      borderColor={colors.border}
    >
      <YStack gap="$2">
        <XStack ai="center" gap="$2">
          <Icon size={16} color={color || colors.textSecondary} />
          <Text color={colors.textSecondary} fontSize="$3">
            {label}
          </Text>
        </XStack>
        <Text color={colors.text} fontSize="$5" fontWeight="700">
          {value}
        </Text>
      </YStack>
    </View>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, value, max, color, icon: Icon, isCurrency = true }) => {
  const colors = useColors();
  const percentage = Math.min((value / max) * 100, 100);

  const formatValue = (val) => {
    if (isCurrency) {
      return formatCurrency(val);
    }
    return val.toString();
  };

  return (
    <YStack gap="$2" w="100%">
      <XStack ai="center" gap="$2">
        {Icon && <Icon size={16} color={colors.textSecondary} />}
        <Text color={colors.textSecondary} fontSize="$3">
          {label}
        </Text>
      </XStack>
      <YStack gap="$2">
        <Text color={colors.text} fontSize="$4" fontWeight="700">
          {formatValue(value)} <Text color={colors.textSecondary}>/ {formatValue(max)}</Text>
        </Text>
        <View h={8} br={4} bg={colors.backgroundTertiary} overflow="hidden" borderWidth={1} borderColor={colors.border}>
          <View h="100%" w={`${percentage}%`} bg={color} br={4} opacity={0.9} animation="quick" />
        </View>
      </YStack>
    </YStack>
  );
};

const ProfileScreen = () => {
  const { setUser } = useAuthContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { cards } = useCards();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, isLoading, error, logout, refreshUser } = useUser();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const limits = {
    monthlyNewCards: {
      current: user?.currentMonthCardIssuance || 0,
      max: user?.monthlyCardIssuanceLimit || 10,
    },
    dailySpend: {
      current: user?.currentDailySpend || 0,
      max: user?.dailySpendLimit || 500,
    },
    monthlySpend: {
      current: user?.currentMonthlySpend || 0,
      max: user?.monthlySpendLimit || 5000,
    },
  };

  // Calculate card stats
  const cardStats = cards.reduce(
    (acc, card) => {
      if (!card.is_closed && !card.is_paused) acc.active++;
      if (card.is_paused) acc.paused++;
      if (card.is_closed) acc.closed++;
      if (card.is_shared) acc.shared++;
      return acc;
    },
    { active: 0, paused: 0, closed: 0, shared: 0 }
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUser]);

  const handleLogout = async () => {
    await deleteToken();
    logout();
  };

  const handlePersonalInfo = () => {
    navigation.navigate(Paths.PERSONAL_INFO);
  };

  const handleSecurity = () => {
    navigation.navigate(Paths.SECURITY);
  };

  const handleConnectBank = () => {
    navigation.navigate('BoubyanLogin', {
      onSuccess: () => {
        refreshUser();
      },
    });
  };

  const handleDisconnectBank = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectBank();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bank account disconnected successfully',
      });
      refreshUser();
      setShowDisconnectConfirm(false);
    } catch (error) {
      console.log('🔴 Error disconnecting bank account:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to disconnect bank account',
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Spinner size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Text color={colors.primary}>Error loading profile</Text>
      </View>
    );
  }

  return (
    <ScrollView
      f={1}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.text}
          colors={[colors.primary]}
          progressBackgroundColor={colors.backgroundSecondary}
          progressViewOffset={10}
        />
      }
    >
      {/* Title Section */}
      <YStack gap="$3" mb="$2" px={16}>
        <XStack ai="center" mb="$2" gap="$2">
          <UserIconFilled size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
            Profile
          </Text>
        </XStack>
      </YStack>

      {/* Profile Header */}
      <YStack ai="center" pb="$6" px="$4" gap="$4">
        <Circle backgroundColor={colors.border} borderWidth={'$2'} borderColor={colors.border}>
          <Avatar circular size="$12">
            <Avatar.Image source={user?.profilePic ? { uri: user?.profilePic } : require('@/../assets/default.png')} />
            <Avatar.Fallback backgroundColor={colors.backgroundSecondary} />
          </Avatar>
        </Circle>
        <YStack ai="center" gap="$1">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </Text>
          <Text color={colors.textSecondary} fontSize="$3">
            {user?.email}
          </Text>
          {/* <XStack ai="center" gap="$2" mt="$2">
            <Text color={colors.textSecondary} fontSize="$3">
              {user?.subscription} Plan
            </Text>
            <Text color={colors.textSecondary} fontSize="$3">
              •
            </Text>
            <Text color={colors.textSecondary} fontSize="$3">
              {user?.phoneNumber}
            </Text>
          </XStack> */}
        </YStack>
      </YStack>

      {/* Account Stats */}
      <YStack px="$4" pb="$6" gap="$4">
        {/* Bank Account Status */}
        <View bg={colors.backgroundSecondary} br={12} p="$4" borderWidth={1} borderColor={colors.border}>
          <YStack gap="$4">
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$3">
                <Image
                  source={require('@/../assets/boubyan-logo-min.png')}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
                <YStack>
                  <Text color={colors.text} fontSize="$4" fontWeight="600">
                    Boubyan Bank
                  </Text>
                  <Text color={colors.textSecondary} fontSize="$2">
                    {user?.bankAccountNumber ? 'Connected' : 'Not Connected'}
                  </Text>
                </YStack>
              </XStack>
              {user?.bankAccountNumber ? (
                <Button
                  size="$3"
                  backgroundColor={`${colors.danger}10`}
                  pressStyle={{ backgroundColor: `${colors.danger}20` }}
                  onPress={() => setShowDisconnectConfirm(true)}
                  borderRadius={8}
                  disabled={isDisconnecting}
                  borderWidth={1}
                  borderColor={`${colors.danger}30`}
                >
                  <XStack ai="center" gap="$2">
                    <XMarkIcon size={16} color={colors.danger} />
                    <Text color={colors.danger} fontSize="$3" fontWeight="600">
                      Disconnect
                    </Text>
                  </XStack>
                </Button>
              ) : (
                <Button
                  size="$3"
                  backgroundColor={colors.primary}
                  pressStyle={{ backgroundColor: colors.primaryDark }}
                  onPress={handleConnectBank}
                  borderRadius={8}
                >
                  <Text color="white" fontSize="$3" fontWeight="600">
                    Connect
                  </Text>
                </Button>
              )}
            </XStack>
            {user?.bankAccountNumber && (
              <View
                backgroundColor={`${colors.backgroundTertiary}80`}
                p="$3"
                br={8}
                borderWidth={1}
                borderColor={colors.border}
              >
                <YStack gap="$2">
                  <XStack ai="center" jc="space-between">
                    <Text color={colors.textSecondary} fontSize="$3">
                      Account Number
                    </Text>
                    <Text color={colors.text} fontSize="$3" fontWeight="600" fontFamily="$mono">
                      {user.bankAccountNumber}
                    </Text>
                  </XStack>
                  <XStack ai="center" jc="space-between">
                    <Text color={colors.textSecondary} fontSize="$3">
                      Username
                    </Text>
                    <Text color={colors.text} fontSize="$3" fontWeight="600" fontFamily="$mono">
                      {user.bankAccountUsername}
                    </Text>
                  </XStack>
                </YStack>
              </View>
            )}
          </YStack>
        </View>
        <XStack gap="$3">
          <View f={1} bg={colors.backgroundSecondary} br={12} p="$4" borderWidth={1} borderColor={colors.border}>
            <Text color={colors.textSecondary} fontSize="$3" mb="$2">
              Active Cards
            </Text>
            <Text color={colors.text} fontSize="$5" fontWeight="700">
              {user?.activeCardsCount || 0}
            </Text>
          </View>
          <View f={1} bg={colors.backgroundSecondary} br={12} p="$4" borderWidth={1} borderColor={colors.border}>
            <Text color={colors.textSecondary} fontSize="$3" mb="$2">
              Member Since
            </Text>
            <Text color={colors.text} fontSize="$3" fontWeight="600">
              {new Date(user?.createdAt || new Date()).toLocaleDateString()}
            </Text>
          </View>
        </XStack>
      </YStack>

      {/* Progress Bars Section */}
      <YStack gap="$3">
        <XStack gap="$3" jc="space-between" ai="flex-end">
          <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" px="$4">
            Account Limits
          </Text>

          <Button
            bg="transparent"
            h={'auto'}
            borderWidth={0}
            mx="$1"
            py="0"
            my="0"
            hitSlop={40}
            pressStyle={{ backgroundColor: 'transparent', opacity: 0.5 }}
          >
            <Text color={colors.text} fontSize="$2" fontWeight="500" textDecorationLine="underline">
              Upgrade Plan
            </Text>
          </Button>
        </XStack>

        <View
          mx="$4"
          mb="$6"
          p="$4"
          backgroundColor={colors.backgroundSecondary}
          br={12}
          borderWidth={1}
          borderColor={colors.border}
        >
          <YStack gap="$6">
            <ProgressBar
              label="Monthly New Cards"
              value={limits.monthlyNewCards.current}
              max={limits.monthlyNewCards.max}
              color={Colors.cards.blue}
              icon={CreditCardIcon}
              isCurrency={false}
            />
            <ProgressBar
              label="Daily Limit"
              value={limits.dailySpend.current}
              max={limits.dailySpend.max}
              color={Colors.cards.green}
              icon={BanknotesIcon}
            />
            <ProgressBar
              label="Monthly Limit"
              value={limits.monthlySpend.current}
              max={limits.monthlySpend.max}
              color={Colors.cards.pink}
              icon={ClockIcon}
            />
          </YStack>
        </View>
      </YStack>

      {/* Menu Items */}
      <YStack gap="$6">
        <YStack gap="$3">
          <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" px="$4">
            Account
          </Text>
          <YStack gap="$2">
            <MenuItem icon={UserIcon} label="Personal Information" onPress={handlePersonalInfo} />
            <MenuItem icon={ShieldCheckIcon} label="Security" onPress={handleSecurity} />
            <MenuItem icon={BellIcon} label="Notifications" onPress={() => {}} />
            <MenuItem icon={Cog6ToothIcon} label="Preferences" onPress={() => {}} />
          </YStack>
        </YStack>

        <YStack gap="$3">
          <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" px="$4">
            Support
          </Text>
          <YStack gap="$2">
            <MenuItem icon={QuestionMarkCircleIcon} label="Help Center" onPress={() => {}} />
            <MenuItem icon={DocumentTextIcon} label="Terms & Privacy" onPress={() => {}} />
          </YStack>
        </YStack>
      </YStack>

      {/* Logout Button */}
      <Button
        mx="$4"
        mt="$6"
        size="$5"
        backgroundColor={colors.backgroundSecondary}
        pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.98 }}
        onPress={() => setShowLogoutConfirm(true)}
        borderWidth={1}
        borderColor={colors.border}
        br={12}
        animation="quick"
      >
        <XStack ai="center" gap="$2">
          <PowerIcon size={20} color={colors.danger} />
          <Text color={colors.danger} fontSize="$4" fontWeight="600">
            Log Out
          </Text>
        </XStack>
      </Button>

      {/* Bank Disconnect Confirmation Sheet */}
      <BottomSheet isOpen={showDisconnectConfirm} onClose={() => setShowDisconnectConfirm(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Disconnect Bank Account
          </Text>
          <Text color={colors.textSecondary} fontSize="$4">
            Are you sure you want to disconnect your bank account? This will affect your ability to use your cards.
          </Text>
          <YStack gap="$3">
            <Button
              backgroundColor={colors.danger}
              pressStyle={{ backgroundColor: colors.danger }}
              onPress={handleDisconnectBank}
              size="$5"
              borderRadius={12}
              disabled={isDisconnecting}
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Text>
            </Button>
            <Button
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => setShowDisconnectConfirm(false)}
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

      {/* Logout Confirmation Sheet */}
      <BottomSheet isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Log Out
          </Text>
          <Text color={colors.textSecondary} fontSize="$4">
            Are you sure you want to log out?
          </Text>
          <YStack gap="$3">
            <Button
              backgroundColor={colors.danger}
              pressStyle={{ backgroundColor: colors.danger }}
              onPress={handleLogout}
              size="$5"
              borderRadius={12}
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                Log Out
              </Text>
            </Button>
            <Button
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => setShowLogoutConfirm(false)}
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
    </ScrollView>
  );
};

export default ProfileScreen;
