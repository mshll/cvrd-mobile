import React, { useRef, useState } from 'react';
import { VideoSlide } from './VideoSlide';
import { View, Share, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Text, YStack, XStack, Card, Button, Image } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { fetchUserTransactions } from '@/api/transactions';
import { getUserCards } from '@/api/cards';
import { useQuery } from '@tanstack/react-query';
import ViewShot from 'react-native-view-shot';
import { ShareIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import { BlurView } from 'expo-blur';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Animation timing constants
const ANIMATION_DELAYS = {
  HEADER: 7000,
  TOTAL_CARDS: 8000,
  TOP_CARD: 8500,
  TOP_CATEGORY: 9000,
  STORES_LIST: 9500,
  SHARE_BUTTON: 11000,
};

// Format currency helper
const formatAmount = (amount) => {
  return `KD ${Number(amount).toFixed(3)}`;
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
    return null;
  }
};

const StatCard = ({ title, value, subtitle, icon, delay, color, valueFirst = true }) => {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 12 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <AnimatedView style={[animatedStyle, { flex: 1 }]}>
      <BlurView intensity={60} tint="dark" style={{ borderRadius: 16, overflow: 'hidden', height: 120 }}>
        <View
          style={{
            padding: 16,
            backgroundColor: `${color}20`,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: `${color}40`,
            height: '100%',
          }}
        >
          <YStack space={8} flex={1}>
            <XStack space={8} alignItems="center">
              {icon}
              <Text color={Colors.dark.textSecondary} fontSize={14} fontWeight="600">
                {title}
              </Text>
            </XStack>
            {valueFirst ? (
              <>
                <YStack f={1} jc="center">
                  <Text color="white" fontSize={28} fontWeight="900" fontFamily="Archivo-Black">
                    {value}
                  </Text>
                  {subtitle && (
                    <Text color={Colors.dark.textSecondary} fontSize={13} numberOfLines={1}>
                      {subtitle}
                    </Text>
                  )}
                </YStack>
              </>
            ) : (
              <>
                <YStack f={1} jc="center" space={4}>
                  {subtitle && (
                    <Text color="white" fontSize={20} fontWeight="900" fontFamily="Archivo-Black" numberOfLines={1}>
                      {subtitle}
                    </Text>
                  )}
                  <Text color={Colors.cards.green} fontSize={16} fontWeight="700">
                    {value}
                  </Text>
                </YStack>
              </>
            )}
          </YStack>
        </View>
      </BlurView>
    </AnimatedView>
  );
};

const StoresList = ({ stores, delay = 2000 }) => {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 12 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedView style={[{ flex: 1 }, animatedStyle]}>
      <BlurView intensity={60} tint="dark" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <View
          style={{
            padding: 16,
            backgroundColor: `${colors.backgroundTertiary}40`,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: `${colors.border}40`,
          }}
        >
          <YStack space={16}>
            <XStack space={8} alignItems="center">
              <Text fontSize={24}>🏪</Text>
              <Text color={Colors.dark.textSecondary} fontSize={14} fontWeight="600">
                TOP STORES
              </Text>
            </XStack>
            <YStack space={12}>
              {stores.map((store, index) => (
                <XStack key={store.name} justifyContent="space-between" alignItems="center">
                  <YStack>
                    <Text color="white" fontSize={16} fontWeight="600">
                      {store.name}
                    </Text>
                    <Text color={Colors.dark.textSecondary} fontSize={13}>
                      {store.visits} visits
                    </Text>
                  </YStack>
                  <Text color={Colors.cards.green} fontSize={16} fontWeight="700">
                    {formatAmount(store.amount)}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </View>
      </BlurView>
    </AnimatedView>
  );
};

export function Slide8Story() {
  const colors = useColors();
  const viewShotRef = useRef();

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const shareButtonOpacity = useSharedValue(0);
  const shareButtonScale = useSharedValue(0.8);
  const [showBackground, setShowBackground] = useState(false);

  // Fetch data
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchUserTransactions,
  });

  const { data: cardsData } = useQuery({
    queryKey: ['cards'],
    queryFn: getUserCards,
  });

  // Process data for stats
  const summaryData = React.useMemo(() => {
    const defaultData = {
      totalCards: 0,
      topCard: { name: 'No Data', amount: 0 },
      topCategory: { name: 'No Data', amount: 0 },
      topStores: [],
    };

    if (!cardsData || !transactionsData) return defaultData;

    // Total Cards
    const totalCards = cardsData.length;

    // Top Card
    const topCard = cardsData
      .filter((card) => !card.closed)
      .sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))[0] || { cardName: 'No Data', totalSpent: 0 };

    // Top Category
    const categoryCards = cardsData.filter((card) => card.cardType === 'CATEGORY_LOCKED' && !card.closed);
    const topCategory = categoryCards.sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))[0] || {
      categoryName: 'No Data',
      totalSpent: 0,
    };

    // Top Stores
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

    const topStores = Object.entries(storeStats)
      .sort(([, a], [, b]) => b.totalSpent - a.totalSpent)
      .slice(0, 3)
      .map(([name, stats]) => ({
        name,
        amount: stats.totalSpent,
        visits: stats.visits,
      }));

    return {
      totalCards,
      topCard: {
        name: topCard.cardName,
        amount: Number(topCard.totalSpent),
      },
      topCategory: {
        name: topCategory.categoryName,
        amount: Number(topCategory.totalSpent),
      },
      topStores,
    };
  }, [cardsData, transactionsData]);

  // Start animations
  React.useEffect(() => {
    // Header animations
    headerOpacity.value = withDelay(ANIMATION_DELAYS.HEADER, withTiming(1, { duration: 1000 }));
    headerTranslateY.value = withDelay(ANIMATION_DELAYS.HEADER, withSpring(0, { damping: 12 }));

    // Share button animations
    shareButtonOpacity.value = withDelay(ANIMATION_DELAYS.SHARE_BUTTON, withTiming(1, { duration: 500 }));
    shareButtonScale.value = withDelay(ANIMATION_DELAYS.SHARE_BUTTON, withSpring(1, { damping: 12 }));
  }, []);

  const handleShare = async () => {
    try {
      // Show background before capture
      setShowBackground(true);

      // Small delay to ensure background is rendered
      await new Promise((resolve) => setTimeout(resolve, 250));

      const uri = await viewShotRef.current.capture();

      await Share.share({
        url: uri,
        title: 'My 2025 CVR Summary',
        message: "Here's my year with CVRD! 💳✨ I secured and tracked my spending, what about you? #2025CVR",
      });

      // Hide background after capture
      setShowBackground(false);
    } catch (error) {
      // Make sure to hide background even if there's an error
      setShowBackground(false);
      console.log('Error sharing:', error);
    }
  };

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide8.MP4')} />
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 1,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
        }}
      >
        {showBackground && (
          <Image
            source={require('@/../assets/summary-bg.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            }}
          />
        )}

        {/* Header */}
        <AnimatedView
          style={[
            {
              marginBottom: 32,
              marginTop: 60,
            },
            useAnimatedStyle(() => ({
              opacity: headerOpacity.value,
              transform: [{ translateY: headerTranslateY.value }],
            })),
          ]}
        >
          <BlurView intensity={60} tint="dark" style={{ borderRadius: 20, overflow: 'hidden' }}>
            <YStack space={8} padding={20}>
              <Text color="white" fontSize={32} fontFamily="Archivo-Black" textAlign="center" fontWeight="900">
                2025 CVR SUMMARY
              </Text>
              <Text color={Colors.dark.textSecondary} fontSize={16} textAlign="center">
                Your year in spending
              </Text>
            </YStack>
          </BlurView>
        </AnimatedView>

        {/* Stats Grid */}
        <YStack space={16} flex={1}>
          {/* Top Row */}
          <XStack space={16}>
            <StatCard
              title="TOTAL CARDS"
              value={summaryData.totalCards}
              icon={<Text fontSize={24}>💳</Text>}
              delay={ANIMATION_DELAYS.TOTAL_CARDS}
              color={Colors.cards.blue}
            />
            <StatCard
              title="TOP CARD"
              value={formatAmount(summaryData.topCard.amount)}
              subtitle={summaryData.topCard.name}
              icon={<Text fontSize={24}>🏆</Text>}
              delay={ANIMATION_DELAYS.TOP_CARD}
              color={Colors.cards.green}
              valueFirst={false}
            />
          </XStack>

          {/* Middle Row */}
          <XStack space={16}>
            <StatCard
              title="TOP CATEGORY"
              value={formatAmount(summaryData.topCategory.amount)}
              subtitle={summaryData.topCategory.name}
              icon={<Text fontSize={24}>📊</Text>}
              delay={ANIMATION_DELAYS.TOP_CATEGORY}
              color={Colors.cards.pink}
              valueFirst={false}
            />
          </XStack>

          {/* Stores List */}
          <StoresList stores={summaryData.topStores} delay={ANIMATION_DELAYS.STORES_LIST} />
        </YStack>
      </ViewShot>

      {/* Share Button */}
      <AnimatedView
        style={[
          {
            position: 'absolute',
            bottom: 40,
            left: 16,
            right: 16,
          },
          useAnimatedStyle(() => ({
            opacity: shareButtonOpacity.value,
            transform: [
              { scale: shareButtonScale.value },
              { translateY: interpolate(shareButtonScale.value, [0.8, 1], [20, 0]) },
            ],
          })),
        ]}
      >
        <BlurView intensity={60} tint="dark" style={{ borderRadius: 20, overflow: 'hidden' }}>
          <Button
            height={56}
            backgroundColor={`${Colors.dark.primary}30`}
            pressStyle={{ backgroundColor: `${Colors.dark.primary}50` }}
            onPress={handleShare}
            borderWidth={1}
            borderColor={`${Colors.dark.primary}40`}
            br={20}
          >
            <XStack ai="center" gap="$2">
              <ShareIcon size={20} color="white" />
              <Text color="white" fontSize={16} fontWeight="700" fontFamily="Archivo-Bold">
                SHARE YOUR 2025 SUMMARY
              </Text>
            </XStack>
          </Button>
        </BlurView>
      </AnimatedView>
    </YStack>
  );
}
