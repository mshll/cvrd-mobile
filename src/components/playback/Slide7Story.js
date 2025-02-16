import React from 'react';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, Card, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { fetchUserTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import { BuildingStorefrontIcon, CurrencyDollarIcon, ShoppingBagIcon } from 'react-native-heroicons/solid';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedView = Animated.createAnimatedComponent(View);

// Format currency helper
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KWD',
    minimumFractionDigits: 3,
  }).format(amount);
};

// Parse transaction description
const parseDescription = (description) => {
  try {
    const data = JSON.parse(description);
    if (data.type === 'STORE_PURCHASE') {
      return {
        storeName: data.merchant.name,
        amount: Number(data.payment.total) || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing transaction description:', error);
    return null;
  }
};

export function Slide7Story() {
  const colors = useColors();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const storeNameOpacity = useSharedValue(0);
  const totalSpentOpacity = useSharedValue(0);
  const visitsOpacity = useSharedValue(0);

  // Fetch transaction data
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchUserTransactions,
  });

  // Process transaction data to find top store
  const topStore = React.useMemo(() => {
    if (!transactionsData || !Array.isArray(transactionsData)) {
      return { name: 'No Data Available', totalSpent: 0, visits: 0 };
    }

    // Group transactions by store
    const storeStats = transactionsData.reduce((acc, transaction) => {
      const parsedData = parseDescription(transaction.description);
      if (!parsedData) return acc;

      const { storeName, amount } = parsedData;
      if (!acc[storeName]) {
        acc[storeName] = { totalSpent: 0, visits: 0 };
      }

      acc[storeName].totalSpent += amount;
      acc[storeName].visits += 1;

      return acc;
    }, {});

    // Find store with highest total spent
    const topStore = Object.entries(storeStats).sort(([, a], [, b]) => b.totalSpent - a.totalSpent)[0];

    return topStore
      ? { name: topStore[0], totalSpent: topStore[1].totalSpent, visits: topStore[1].visits }
      : { name: 'No Data Available', totalSpent: 0, visits: 0 };
  }, [transactionsData]);

  // Animations
  React.useEffect(() => {
    // Title appears at 1 second
    const titleAppear = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);

    // Subtitle appears at 2 seconds
    const subtitleAppear = setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 500 });
    }, 2000);

    // Store stats appear at 8 seconds
    const storeNameAppear = setTimeout(() => {
      storeNameOpacity.value = withTiming(1, { duration: 500 });
    }, 8000);

    const totalSpentAppear = setTimeout(() => {
      totalSpentOpacity.value = withTiming(1, { duration: 500 });
    }, 8500);

    const visitsAppear = setTimeout(() => {
      visitsOpacity.value = withTiming(1, { duration: 500 });
    }, 9000);

    // Everything disappears at 12 seconds
    const disappearTimeouts = [titleOpacity, subtitleOpacity, storeNameOpacity, totalSpentOpacity, visitsOpacity].map(
      (opacity) => {
        return setTimeout(() => {
          opacity.value = withTiming(0, { duration: 500 });
        }, 12000);
      }
    );

    return () => {
      clearTimeout(titleAppear);
      clearTimeout(subtitleAppear);
      clearTimeout(storeNameAppear);
      clearTimeout(totalSpentAppear);
      clearTimeout(visitsAppear);
      disappearTimeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide7.MP4')} />

      {/* Title Section */}
      <YStack pos="absolute" t="15%" l={0} r={0} gap="$4">
        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$8"
          color="$white"
          textAlign="center"
          textShadowRadius={5}
          style={useAnimatedStyle(() => ({
            opacity: titleOpacity.value,
          }))}
        >
          WE LOVE{'\n'}LOYAL CUSTOMERS
        </AnimatedText>

        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$4"
          color="$white"
          textAlign="center"
          textShadowRadius={5}
          style={useAnimatedStyle(() => ({
            opacity: subtitleOpacity.value,
          }))}
        >
          YOU COULDN'T GET ENOUGH{'\n'}OF THIS SHOP!
        </AnimatedText>
      </YStack>

      {/* Store Stats */}
      <YStack pos="absolute" t="30%" l={0} r={0} px="$4" gap="$4">
        {/* Store Name Card */}
        <AnimatedCard
          bg={colors.backgroundSecondary + 'E6'}
          br={16}
          p="$4"
          borderWidth={1}
          borderColor={colors.border}
          style={useAnimatedStyle(() => ({
            opacity: storeNameOpacity.value,
          }))}
        >
          <XStack ai="center" gap="$3">
            <BuildingStorefrontIcon size={24} color={Colors.cards.pink} />
            <Text fontFamily="$archivoBlack" fontSize="$8" color={colors.text}>
              {topStore.name}
            </Text>
          </XStack>
        </AnimatedCard>

        {/* Total Spent Card */}
        <AnimatedCard
          bg={colors.backgroundSecondary + 'E6'}
          br={16}
          p="$4"
          borderWidth={1}
          borderColor={colors.border}
          style={useAnimatedStyle(() => ({
            opacity: totalSpentOpacity.value,
          }))}
        >
          <YStack gap="$2">
            <XStack ai="center" gap="$3">
              <CurrencyDollarIcon size={24} color={Colors.cards.green} />
              <Text fontFamily="$body" fontSize="$5" color={colors.textSecondary}>
                Total Spent
              </Text>
            </XStack>
            <Text fontFamily="$archivoBlack" fontSize="$9" color={colors.text}>
              {formatAmount(topStore.totalSpent)}
            </Text>
          </YStack>
        </AnimatedCard>

        {/* Visits Card */}
        <AnimatedCard
          bg={colors.backgroundSecondary + 'E6'}
          br={16}
          p="$4"
          borderWidth={1}
          borderColor={colors.border}
          style={useAnimatedStyle(() => ({
            opacity: visitsOpacity.value,
          }))}
        >
          <YStack gap="$2">
            <XStack ai="center" gap="$3">
              <ShoppingBagIcon size={24} color={Colors.cards.blue} />
              <Text fontFamily="$body" fontSize="$5" color={colors.textSecondary}>
                Total Visits
              </Text>
            </XStack>
            <XStack ai="flex-end" gap="$2">
              <Text fontFamily="$archivoBlack" fontSize="$9" color={colors.text}>
                {topStore.visits}
              </Text>
              <Text fontFamily="$body" fontSize="$4" color={colors.textSecondary} mb="$1">
                purchases
              </Text>
            </XStack>
          </YStack>
        </AnimatedCard>
      </YStack>
    </YStack>
  );
}
