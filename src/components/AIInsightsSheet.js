import React, { useEffect } from 'react';
import { ScrollView, View, Animated as RNAnimated } from 'react-native';
import { Text, YStack, XStack, Card } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';
import BottomSheet from '@/components/BottomSheet';
import { ChartBarIcon, BanknotesIcon, ClockIcon, ShoppingBagIcon, LightBulbIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

const AnimatedCard = Animated.createAnimatedComponent(Card);

// Skeleton loader component
const SkeletonLoader = ({ children, style }) => {
  const colors = useColors();
  const animatedValue = new RNAnimated.Value(0);

  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(animatedValue, {
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
    <RNAnimated.View
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
    </RNAnimated.View>
  );
};

// Skeleton section component
const SkeletonSection = ({ delay = 0 }) => {
  const colors = useColors();
  return (
    <Card
      bg={colors.backgroundSecondary}
      mb="$4"
      p="$4"
      br={12}
      animation="quick"
    >
      <YStack f={1} jc="space-between">
        {/* Header */}
        <XStack ai="center" gap="$2" mb="$4">
          <SkeletonLoader style={{ width: 24, height: 24, borderRadius: 12 }}>
            <View f={1} />
          </SkeletonLoader>
          <SkeletonLoader style={{ width: 140, height: 24, borderRadius: 6 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>

        {/* Content Lines */}
        <YStack gap="$3">
          {[1, 2, 3].map((item) => (
            <XStack key={item} gap="$2" ai="center">
              <SkeletonLoader style={{ width: 8, height: 8, borderRadius: 4 }}>
                <View f={1} />
              </SkeletonLoader>
              <SkeletonLoader style={{ width: '85%', height: 20, borderRadius: 6 }}>
                <View f={1} />
              </SkeletonLoader>
            </XStack>
          ))}
        </YStack>
      </YStack>
    </Card>
  );
};

function InsightSection({ title, items, icon: Icon, delay = 0 }) {
  const colors = useColors();

  if (!items || items.length === 0) return null;

  return (
    <AnimatedCard
      entering={FadeInDown.delay(delay).springify()}
      exiting={FadeOut}
      bg={colors.card}
      mb="$4"
      p="$4"
      br={16}
      borderWidth={1}
      borderColor={colors.border}
    >
      <XStack ai="center" gap="$2" mb="$3">
        <Icon size={20} color={colors.primary} />
        <Text color={colors.text} fontSize="$5" fontWeight="600">
          {title}
        </Text>
      </XStack>
      <YStack gap="$2">
        {items.map((item, index) => (
          <XStack key={index} gap="$2">
            <Text color={colors.textSecondary} fontSize={16}>
              •
            </Text>
            <Text color={colors.text} fontSize="$4" lineHeight={24}>
              {item}
            </Text>
          </XStack>
        ))}
      </YStack>
    </AnimatedCard>
  );
}

export function AIInsightsSheet({ isOpen, onClose, insights, isLoading }) {
  const colors = useColors();

  if (!insights && !isLoading) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={['85%']}
      initialSnap={0}
      animateToPosition={0}
      enablePanDownToClose
      enableContentPanningGesture
    >
      <YStack px="$4" pt="$4" pb="$15" f={1}>
        {/* <AnimatedCard
          entering={FadeInDown.springify()}
          bg={colors.card}
          mb="$4"
          p="$4"
          br={16}
          borderWidth={1}
          borderColor={colors.border}
        >
          <Text color={colors.text} fontSize="$6" fontWeight="700" textAlign="center">
            AI Spending Analysis
          </Text>
        </AnimatedCard> */}

        {isLoading ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            bounces={false}
          >
            <SkeletonSection delay={100} />
            <SkeletonSection delay={200} />
            <SkeletonSection delay={300} />
            <SkeletonSection delay={400} />
            <SkeletonSection delay={500} />
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            bounces={false}
          >
            <InsightSection title="Overview" items={insights?.overview} icon={ChartBarIcon} delay={100} />
            <InsightSection title="Potential Savings" items={insights?.savings} icon={BanknotesIcon} delay={200} />
            <InsightSection
              title="Subscription Analysis"
              items={insights?.subscriptionAdvice}
              icon={ClockIcon}
              delay={300}
            />
            <InsightSection
              title="Smart Shopping Tips"
              items={insights?.shoppingTips}
              icon={ShoppingBagIcon}
              delay={400}
            />
            <InsightSection
              title="Recommendations"
              items={insights?.recommendations}
              icon={LightBulbIcon}
              delay={500}
            />
          </ScrollView>
        )}
      </YStack>
    </BottomSheet>
  );
}
