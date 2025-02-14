import React from 'react';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { fetchUserTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';

const AnimatedText = Animated.createAnimatedComponent(Text);

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
      <YStack pos="absolute" t="30%" l={0} r={0} gap="$2">
        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$12"
          color="black"
          textAlign="center"
          textShadowRadius={5}
          style={useAnimatedStyle(() => ({
            opacity: storeNameOpacity.value,
          }))}
        >
          {topStore.name}
        </AnimatedText>

        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$6"
          color="black"
          textAlign="center"
          textShadowRadius={5}
          style={useAnimatedStyle(() => ({
            opacity: totalSpentOpacity.value,
          }))}
        >
          You spent{'\n\n'}
          <Text 
            fontFamily="$archivoBlack"
            fontSize="$10"
            color={Colors.dark.primary}
          >
            {formatAmount(topStore.totalSpent)}
          </Text>
          {'\n\n'}and made a total of{'\n\n'}
          <Text
            fontFamily="$archivoBlack"
            fontSize="$10"
            color={Colors.dark.primary}
          >
            {topStore.visits}
          </Text>
          {'\n\n'}purchases!
        </AnimatedText>
      </YStack>
    </YStack>
  );
}
