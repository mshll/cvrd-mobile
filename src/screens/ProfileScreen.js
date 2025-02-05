import { Colors, useColors } from '@/config/colors';
import { View, Text, YStack, XStack, Button, Avatar, ScrollView, Circle, Spinner } from 'tamagui';
import { useUser } from '@/hooks/useUser';
import { useCards } from '@/hooks/useCards';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '@/utils/utils';
import { StyleSheet } from 'react-native';
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
} from 'react-native-heroicons/outline';
import { useState } from 'react';
import BottomSheet from '@/components/BottomSheet';
import { Paths } from '@/navigation/paths';
import { deleteToken } from '@/api/storage';
import { useAuthContext } from '@/context/AuthContext';

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

const ProfileScreen = () => {
  const { setUser } = useAuthContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { cards } = useCards();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, isLoading, error } = useUser();

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

  const handleLogout = async () => {
    await deleteToken();
    setUser(null);
  };

  const handlePersonalInfo = () => {
    navigation.navigate(Paths.PERSONAL_INFO);
  };

  const handleSecurity = () => {
    navigation.navigate(Paths.SECURITY);
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
    <View f={1} bg={colors.background}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Profile Header */}
        <YStack ai="center" pt={'$5'} pb="$6" px="$4" gap="$4">
          <Circle backgroundColor={colors.border} borderWidth={'$2'} borderColor={colors.border}>
            <Avatar circular size="$12">
              <Avatar.Image
                source={user?.profilePic ? { uri: user?.profilePic } : require('@/../assets/default.png')}
              />
              <Avatar.Fallback backgroundColor={colors.backgroundSecondary}>
                <UserIcon size={32} color={colors.textSecondary} />
              </Avatar.Fallback>
            </Avatar>
          </Circle>
          <YStack ai="center" gap="$1">
            <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </Text>
            <Text color={colors.textSecondary} fontSize="$3">
              {user?.email}
            </Text>
          </YStack>
        </YStack>

        {/* Stats Grid */}
        <YStack px="$4" gap="$4" mb="$6">
          <XStack gap="$3">
            <StatCard icon={BanknotesIcon} label="Monthly Spend" value={formatCurrency(0)} color={Colors.cards.green} />
            <StatCard icon={CreditCardIcon} label="Active Cards" value={cardStats.active} color={Colors.cards.blue} />
          </XStack>
          <XStack gap="$3">
            <StatCard icon={ShareIcon} label="Shared Cards" value={cardStats.shared} color={Colors.cards.yellow} />
            <StatCard
              icon={ClockIcon}
              label="Member Since"
              value={user ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}
              color={Colors.cards.pink}
            />
          </XStack>
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
            <PowerIcon size={20} color={Colors.cards.pink} />
            <Text color={Colors.cards.pink} fontSize="$4" fontWeight="600">
              Log Out
            </Text>
          </XStack>
        </Button>
      </ScrollView>

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
              backgroundColor={Colors.cards.pink}
              pressStyle={{ backgroundColor: Colors.cards.pink }}
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
    </View>
  );
};

export default ProfileScreen;
