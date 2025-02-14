import React, { useRef } from 'react';
import { VideoSlide } from './VideoSlide';
import { View, Share } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, XStack, Card, Button } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { fetchUserTransactions } from '@/api/transactions';
import { getUserCards } from '@/api/cards';
import { useQuery } from '@tanstack/react-query';
import ViewShot from 'react-native-view-shot';
import { ShareIcon } from 'react-native-heroicons/solid';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedButton = Animated.createAnimatedComponent(Button);

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
    return null;
  }
};

export function Slide8Story() {
  const colors = useColors();
  const viewShotRef = useRef();

  // Animation values
  const cardOpacity = useSharedValue(0);
  const quadrantOpacities = Array(4)
    .fill(0)
    .map(() => useSharedValue(0));

  // Add share button opacity animation
  const shareButtonOpacity = useSharedValue(0);

  // Fetch data
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchUserTransactions,
  });

  const { data: cardsData } = useQuery({
    queryKey: ['cards'],
    queryFn: getUserCards,
  });

  // Process data for each quadrant
  const summaryData = React.useMemo(() => {
    const defaultData = {
      totalCards: 0,
      topCard: { name: 'No Data', amount: 0 },
      topCategory: { name: 'No Data', amount: 0 },
      topStore: { name: 'No Data', amount: 0, visits: 0 },
    };

    if (!cardsData || !transactionsData) return defaultData;

    // Slide 2 - Total Cards
    const totalCards = cardsData.length;

    // Slide 3 - Top Card
    const topCard = cardsData
      .filter((card) => !card.closed)
      .sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))[0] || { cardName: 'No Data', totalSpent: 0 };

    // Slide 5 - Top Category
    const categoryCards = cardsData.filter((card) => card.cardType === 'CATEGORY_LOCKED' && !card.closed);
    const topCategory = categoryCards.sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))[0] || {
      categoryName: 'No Data',
      totalSpent: 0,
    };

    // Slide 6 - Top Store
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

    const topStore = Object.entries(storeStats).sort(([, a], [, b]) => b.totalSpent - a.totalSpent)[0] || [
      'No Data',
      { totalSpent: 0, visits: 0 },
    ];

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
      topStore: {
        name: topStore[0],
        amount: topStore[1].totalSpent,
        visits: topStore[1].visits,
      },
    };
  }, [cardsData, transactionsData]);

  // Animations
  React.useEffect(() => {
    // Card appears at 6 seconds
    const cardAppear = setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 500 });
    }, 6000);

    // Quadrants appear one by one starting at 7 seconds
    const quadrantTimeouts = quadrantOpacities.map((opacity, index) => {
      return setTimeout(() => {
        opacity.value = withTiming(1, { duration: 500 });
      }, 7000 + index * 700); // 700ms between each quadrant
    });

    // Show share button at 13 seconds (5 seconds before end)
    const shareButtonAppear = setTimeout(() => {
      shareButtonOpacity.value = withTiming(1, { duration: 500 });
    }, 10000);

    return () => {
      clearTimeout(cardAppear);
      quadrantTimeouts.forEach(clearTimeout);
      clearTimeout(shareButtonAppear);
    };
  }, []);

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.share({
        url: uri,
        title: 'My 2025 CVR Summary',
        message: 'Check out my 2025 CVR card usage summary!',
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
          top: '20%',
          bottom: '20%',
          left: 16,
          right: 16,
        }}
      >
        <AnimatedCard
          pos="absolute"
          t={0}
          b={0}
          l={0}
          r={0}
          backgroundColor="transparent"
          borderRadius="$6"
          borderWidth={1}
          borderColor={colors.border}
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
          }))}
        >
          <YStack f={1} p="$4" gap="$4">
            {/* Title */}
            <Text fontFamily="$archivoBlack" fontSize="$6" color="$white" textAlign="center" opacity={1}>
              SHARE YOUR 2025 CVR
            </Text>

            {/* Quadrants */}
            <YStack f={1} gap="$4">
              {/* Top Row */}
              <XStack f={1} gap="$4">
                {/* Total Cards */}
                <AnimatedView
                  style={[
                    {
                      flex: 1,
                      backgroundColor: `${colors.backgroundTertiary}95`,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    },
                    useAnimatedStyle(() => ({
                      opacity: quadrantOpacities[0].value,
                    })),
                  ]}
                >
                  <Text fontFamily="$archivoBlack" fontSize="$3" color="$white" textAlign="center" opacity={1}>
                    TOTAL CARDS
                  </Text>
                  <Text
                    fontFamily="$archivoBlack"
                    fontSize="$10"
                    color={Colors.dark.primary}
                    textAlign="center"
                    opacity={1}
                  >
                    {summaryData.totalCards}
                  </Text>
                </AnimatedView>

                {/* Top Card */}
                <AnimatedView
                  style={[
                    {
                      flex: 1,
                      backgroundColor: `${colors.backgroundTertiary}95`,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    },
                    useAnimatedStyle(() => ({
                      opacity: quadrantOpacities[1].value,
                    })),
                  ]}
                >
                  <Text fontFamily="$archivoBlack" fontSize="$3" color="$white" textAlign="center" opacity={1}>
                    TOP CARD
                  </Text>
                  <Text fontFamily="$archivoBlack" fontSize="$4" color="$white" textAlign="center" opacity={1}>
                    {summaryData.topCard.name}
                  </Text>
                  <Text
                    fontFamily="$archivoBlack"
                    fontSize="$8"
                    color={Colors.dark.primary}
                    textAlign="center"
                    opacity={1}
                  >
                    {formatAmount(summaryData.topCard.amount)}
                  </Text>
                </AnimatedView>
              </XStack>

              {/* Bottom Row */}
              <XStack f={1} gap="$4">
                {/* Top Category */}
                <AnimatedView
                  style={[
                    {
                      flex: 1,
                      backgroundColor: `${colors.backgroundTertiary}95`,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    },
                    useAnimatedStyle(() => ({
                      opacity: quadrantOpacities[2].value,
                    })),
                  ]}
                >
                  <Text fontFamily="$archivoBlack" fontSize="$3" color="$white" textAlign="center" opacity={1}>
                    TOP CATEGORY
                  </Text>
                  <Text fontFamily="$archivoBlack" fontSize="$4" color="$white" textAlign="center" opacity={1}>
                    {summaryData.topCategory.name}
                  </Text>
                  <Text
                    fontFamily="$archivoBlack"
                    fontSize="$8"
                    color={Colors.dark.primary}
                    textAlign="center"
                    opacity={1}
                  >
                    {formatAmount(summaryData.topCategory.amount)}
                  </Text>
                </AnimatedView>

                {/* Top Store */}
                <AnimatedView
                  style={[
                    {
                      flex: 1,
                      backgroundColor: `${colors.backgroundTertiary}95`,
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    },
                    useAnimatedStyle(() => ({
                      opacity: quadrantOpacities[3].value,
                    })),
                  ]}
                >
                  <Text fontFamily="$archivoBlack" fontSize="$3" color="$white" textAlign="center" opacity={1}>
                    TOP STORE
                  </Text>
                  <Text fontFamily="$archivoBlack" fontSize="$4" color="$white" textAlign="center" opacity={1}>
                    {summaryData.topStore.name}
                  </Text>
                  <Text
                    fontFamily="$archivoBlack"
                    fontSize="$8"
                    color={Colors.dark.primary}
                    textAlign="center"
                    opacity={1}
                  >
                    {formatAmount(summaryData.topStore.amount)}
                  </Text>
                  <Text
                    fontFamily="$archivoBlack"
                    fontSize="$5"
                    color={Colors.dark.primary}
                    textAlign="center"
                    opacity={1}
                  >
                    {summaryData.topStore.visits} Visits
                  </Text>
                </AnimatedView>
              </XStack>
            </YStack>
          </YStack>
        </AnimatedCard>
      </ViewShot>

      {/* Share Button */}
      <AnimatedButton
        pos="absolute"
        b="$4"
        r="$4"
        size="$5"
        circular
        icon={<ShareIcon size={24} color="white" />}
        backgroundColor={Colors.dark.primary}
        pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
        onPress={handleShare}
        style={useAnimatedStyle(() => ({
          opacity: shareButtonOpacity.value,
        }))}
      />
    </YStack>
  );
}
