import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Text, ScrollView, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SubscriptionCard from '@/components/SubscriptionCard';
import MerchantList from '@/components/MerchantList';
import StoreList from '@/components/StoreList';
import { ArrowPathIcon } from 'react-native-heroicons/solid';
import { StyleSheet, Dimensions, Animated, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

// Constants for card dimensions
const CARD_WIDTH = 300;
const CARD_MARGIN = 16;
const SCREEN_PADDING = 16;

// Skeleton component for loading state
const SkeletonLoader = ({ children, style }) => {
  const colors = useColors();
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          opacity,
          backgroundColor: colors.backgroundTertiary,
          borderRadius: 12,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Add pattern background for subscription card skeleton
const SubscriptionCardPattern = () => {
  const colors = useColors();
  return (
    <View
      position="absolute"
      width="100%"
      height="100%"
      opacity={0.1}
      backgroundColor={colors.backgroundTertiary}
      style={{
        transform: [{ rotate: '-15deg' }, { scale: 2 }],
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          position="absolute"
          width={200}
          height={20}
          backgroundColor={colors.background}
          style={{
            top: i * 50 - 100,
            left: i * 20 - 100,
          }}
        />
      ))}
    </View>
  );
};

// Skeleton layout for subscription cards
const SubscriptionCardSkeleton = () => {
  const colors = useColors();
  return (
    <View
      width={CARD_WIDTH}
      height={180}
      backgroundColor={colors.backgroundSecondary}
      borderRadius={20}
      overflow="hidden"
      marginRight={CARD_MARGIN}
      padding={20}
    >
      <YStack f={1} jc="space-between">
        {/* Top Row: Logo and Pause Button */}
        <XStack jc="space-between" ai="center">
          <SkeletonLoader style={{ width: 120, height: 40, borderRadius: 8 }}>
            <View f={1} />
          </SkeletonLoader>
          <SkeletonLoader style={{ width: 40, height: 40, borderRadius: 10 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>

        {/* Bottom Row: Amount and Date */}
        <YStack gap={8}>
          <SkeletonLoader style={{ width: 80, height: 24, borderRadius: 6 }}>
            <View f={1} />
          </SkeletonLoader>
          <SkeletonLoader style={{ width: 160, height: 16, borderRadius: 6 }}>
            <View f={1} />
          </SkeletonLoader>
        </YStack>
      </YStack>
    </View>
  );
};

// Skeleton layout for merchant cards
const MerchantCardSkeleton = () => {
  const colors = useColors();
  return (
    <View
      backgroundColor={colors.backgroundSecondary}
      borderRadius={16}
      overflow="hidden"
      marginBottom={12}
      padding={16}
    >
      <YStack gap={12}>
        {/* Logo and Subscribe Button */}
        <XStack justifyContent="space-between" alignItems="center">
          <SkeletonLoader style={{ width: 120, height: 32, borderRadius: 6 }}>
            <View f={1} />
          </SkeletonLoader>
          <SkeletonLoader style={{ width: 120, height: 36, borderRadius: 8 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>

        {/* Description */}
        <SkeletonLoader style={{ width: '100%', height: 16, borderRadius: 6 }}>
          <View f={1} />
        </SkeletonLoader>

        {/* Starting Price */}
        <SkeletonLoader style={{ width: 120, height: 16, borderRadius: 6 }}>
          <View f={1} />
        </SkeletonLoader>
      </YStack>
    </View>
  );
};

// Skeleton layout for store cards
const StoreCardSkeleton = () => {
  const colors = useColors();
  return (
    <View
      backgroundColor={colors.backgroundSecondary}
      borderRadius={16}
      overflow="hidden"
      marginBottom={12}
      padding={16}
    >
      <YStack gap={12}>
        {/* Logo and Buttons */}
        <XStack justifyContent="space-between" alignItems="center">
          <YStack gap={4}>
            <SkeletonLoader style={{ width: 120, height: 32, borderRadius: 6 }}>
              <View f={1} />
            </SkeletonLoader>
            <SkeletonLoader style={{ width: 80, height: 16, borderRadius: 6 }}>
              <View f={1} />
            </SkeletonLoader>
          </YStack>
          <XStack gap={8}>
            <SkeletonLoader style={{ width: 120, height: 36, borderRadius: 8 }}>
              <View f={1} />
            </SkeletonLoader>
            <SkeletonLoader style={{ width: 36, height: 36, borderRadius: 8 }}>
              <View f={1} />
            </SkeletonLoader>
          </XStack>
        </XStack>

        {/* Description */}
        <SkeletonLoader style={{ width: '100%', height: 16, borderRadius: 6 }}>
          <View f={1} />
        </SkeletonLoader>

        {/* Discount Amount */}
        <SkeletonLoader style={{ width: 80, height: 16, borderRadius: 6 }}>
          <View f={1} />
        </SkeletonLoader>
      </YStack>
    </View>
  );
};

// Loading skeleton for the entire screen
const LoadingSkeleton = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      f={1}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Subscriptions Section Skeleton */}
      <YStack gap="$4" mb="$6">
        <XStack ai="center" gap="$2" px="$4">
          <ArrowPathIcon size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
            Subscriptions
          </Text>
        </XStack>

        {/* Single Subscription Card Skeleton */}
        <View px="$4">
          <SubscriptionCardSkeleton />
        </View>
      </YStack>

      {/* Merchant List Skeleton */}
      <YStack mb="$6" px="$4">
        <XStack ai="center" jc="space-between" mb="$4">
          <XStack ai="center" gap="$2">
            <SkeletonLoader style={{ width: 20, height: 20, borderRadius: 10 }}>
              <View f={1} />
            </SkeletonLoader>
            <SkeletonLoader style={{ width: 150, height: 20 }}>
              <View f={1} />
            </SkeletonLoader>
          </XStack>
          <SkeletonLoader style={{ width: 80, height: 16 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>
        {[1, 2, 3].map((key) => (
          <MerchantCardSkeleton key={key} />
        ))}
      </YStack>

      {/* Store List Skeleton */}
      <YStack mb="$6" px="$4">
        <XStack ai="center" jc="space-between" mb="$4">
          <XStack ai="center" gap="$2">
            <SkeletonLoader style={{ width: 20, height: 20, borderRadius: 10 }}>
              <View f={1} />
            </SkeletonLoader>
            <SkeletonLoader style={{ width: 150, height: 20 }}>
              <View f={1} />
            </SkeletonLoader>
          </XStack>
          <SkeletonLoader style={{ width: 80, height: 16 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>
        {[1, 2, 3].map((key) => (
          <StoreCardSkeleton key={key} />
        ))}
      </YStack>
    </ScrollView>
  );
};

const SubscriptionsScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { subscriptions, isLoading, refetch, toggleSubscription, isToggling } = useSubscriptions();

  const handleToggleSubscription = (subscriptionId) => {
    if (!isToggling) {
      toggleSubscription(subscriptionId);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <View f={1} bg={colors.background}>
      <ScrollView
        contentContainerStyle={styles.container}
        pt={insets.top - 20}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.text}
            colors={[colors.primary]}
            progressBackgroundColor={colors.backgroundSecondary}
          />
        }
      >
        {/* Subscriptions Section */}
        <YStack gap="$4" mb="$6">
          <XStack ai="center" gap="$2" px="$4">
            <ArrowPathIcon size={20} color={colors.text} />
            <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack" fontWeight="900">
              Subscriptions
            </Text>
          </XStack>

          {/* Subscription Cards */}
          {subscriptions.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              snapToInterval={CARD_WIDTH + CARD_MARGIN}
              decelerationRate="fast"
              snapToAlignment="center"
              pagingEnabled={false}
            >
              {subscriptions.map((subscription) => (
                <View key={subscription.id} style={styles.cardWrapper}>
                  <SubscriptionCard subscription={subscription} onToggle={handleToggleSubscription} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View px="$4" py="$6">
              <Text color={colors.textSecondary} fontSize="$3" textAlign="center">
                No active subscriptions
              </Text>
            </View>
          )}
        </YStack>

        {/* Merchant List */}
        <YStack mb="$6">
          <MerchantList />
        </YStack>

        {/* Store List */}
        <YStack mb="$6">
          <StoreList />
        </YStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  cardsContainer: {
    paddingHorizontal: SCREEN_PADDING,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
  },
});

export default SubscriptionsScreen;
