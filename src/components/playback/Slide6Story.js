import React from 'react';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, Spinner } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { fetchUserTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';

const AnimatedText = Animated.createAnimatedComponent(Text);

// Default subscription data for when we don't have enough items
const DEFAULT_SUBSCRIPTIONS = [
  { cardId: 'default-1', totalSpent: 0, label: 'Not Enough Data' },
  { cardId: 'default-2', totalSpent: 0, label: 'Not Enough Data' },
  { cardId: 'default-3', totalSpent: 0, label: 'Not Enough Data' },
  { cardId: 'default-4', totalSpent: 0, label: 'Not Enough Data' },
];

// Format currency helper
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KWD',
    minimumFractionDigits: 3,
  }).format(amount);
};

export function Slide6Story() {
  const colors = Colors;

  // Animation values
  const titleOpacity = useSharedValue(0);
  const subscriptionOpacities = Array(4)
    .fill(0)
    .map(() => useSharedValue(0));

  // Fetch subscription data using TanStack Query
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchUserTransactions,
  });

  // Process transactions data to get subscriptions
  const subscriptions = React.useMemo(() => {
    if (!transactionsData || !Array.isArray(transactionsData)) {
      return DEFAULT_SUBSCRIPTIONS;
    }

    // Group recurring transactions by cardId
    const recurringByCard = transactionsData.reduce((acc, transaction) => {
      if (!transaction?.recurring || !transaction?.cardId) {
        return acc;
      }

      const cardId = transaction.cardId;
      if (!acc[cardId]) {
        acc[cardId] = {
          cardId,
          totalSpent: 0,
          transactions: [],
          merchant: transaction.merchant, // Keep track of the merchant for display
        };
      }

      // Add the transaction amount to the card's total
      acc[cardId].totalSpent += Number(transaction.amount) || 0;
      acc[cardId].transactions.push(transaction);

      return acc;
    }, {});

    // Convert to array and sort by total spent
    const sortedSubscriptions = Object.values(recurringByCard)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 4)
      .map((card) => ({
        ...card,
        label: card.merchant || `Card ${card.cardId}`, // Use merchant name or card ID as label
      }));

    // If we don't have enough subscriptions, pad with defaults
    if (sortedSubscriptions.length < 4) {
      return [...sortedSubscriptions, ...DEFAULT_SUBSCRIPTIONS.slice(sortedSubscriptions.length)];
    }

    return sortedSubscriptions;
  }, [transactionsData]);

  // Animation effect
  React.useEffect(() => {
    // Title appears at 1 second
    const titleAppear = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);

    // Subscriptions appear one by one starting at 6 seconds
    const subscriptionTimeouts = subscriptionOpacities.map((opacity, index) => {
      return setTimeout(() => {
        opacity.value = withTiming(1, { duration: 300 });
      }, 6000 + index * 400); // 400ms between each item
    });

    // Everything disappears at 9 seconds
    const disappearTimeouts = [titleOpacity, ...subscriptionOpacities].map((opacity) => {
      return setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
      }, 9000);
    });

    // Clean up timeouts
    return () => {
      clearTimeout(titleAppear);
      subscriptionTimeouts.forEach(clearTimeout);
      disappearTimeouts.forEach(clearTimeout);
    };
  }, []);

  // Animated styles
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  // Log error if any
  React.useEffect(() => {
    if (error) {
      console.log('Error fetching subscription data:', error);
    }
  }, [error]);

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide6.MP4')} />

      {/* Loading Spinner */}
      {isLoading && (
        <YStack pos="absolute" f={1} ai="center" jc="center" t={0} l={0} r={0} b={0}>
          <Spinner size="large" color="$white" />
        </YStack>
      )}

      {/* Title */}
      <AnimatedText
        pos="absolute"
        t="15%"
        l={0}
        r={0}
        fontFamily="$archivoBlack"
        fontSize="$8"
        color="$white"
        textAlign="center"
        textShadowRadius={5}
        style={titleStyle}
      >
        YOU LOVED THESE{'\n'}PLATFORMS ALL YEAR
      </AnimatedText>

      {/* Subscription List */}
      <YStack pos="absolute" b="15%" l={0} r={0} gap="$4" px="$4">
        {subscriptions.map((subscription, index) => (
          <AnimatedText
            key={`${subscription.cardId}-${index}`}
            fontFamily="$archivoBlack"
            fontSize="$6"
            color="$white"
            textAlign="center"
            textShadowRadius={5}
            style={useAnimatedStyle(() => ({
              opacity: subscriptionOpacities[index].value,
            }))}
          >
            {index + 1}. {subscription.label}
            {subscription.totalSpent > 0 && ` • ${formatAmount(subscription.totalSpent)}`}
          </AnimatedText>
        ))}
      </YStack>
    </YStack>
  );
}
