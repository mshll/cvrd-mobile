import React, { useEffect, useState } from 'react';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, View } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { getUserCards } from '@/api/cards';
import { fetchUserTransactions } from '@/api/transactions';
import { CARD_DEFAULTS } from '@/api/cards';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedView = Animated.createAnimatedComponent(View);

// Placeholder positions for the squares - you can adjust these
const SQUARE_POSITIONS = [
  { top: '21%', left: '5%', rotate: '-6deg' },
  { top: '8%', left: '54%', rotate: '14deg' },
  { top: '87%', left: '6%', rotate: '-9deg' },
  { top: '67%', left: '54%', rotate: '8deg' },
];

const CATEGORIES = ['FOOD', 'SHOPPING', 'TRAVEL', 'ENTERTAINMENT'];

const DEFAULT_CATEGORY_EMOJIS = {
  FOOD: '🍽️',
  SHOPPING: '🛍️',
  TRAVEL: '✈️',
  ENTERTAINMENT: '🎬',
};

export function Slide5Story() {
  const colors = Colors;
  const [topCards, setTopCards] = useState(
    CATEGORIES.reduce(
      (acc, category) => ({
        ...acc,
        [category]: {
          name: 'No Cards Yet',
          category: category,
          cardIcon: DEFAULT_CATEGORY_EMOJIS[category] || '💳',
        },
      }),
      {}
    )
  );

  // Animation values
  const titleOpacity = useSharedValue(0);
  const emojiOpacities = SQUARE_POSITIONS.map(() => useSharedValue(0));
  const nameOpacities = SQUARE_POSITIONS.map(() => useSharedValue(0));
  const categoryOpacities = SQUARE_POSITIONS.map(() => useSharedValue(0));

  // Format card type for display
  const formatCardType = (type) => {
    return type
      .replace('_LOCKED', '')
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    async function fetchCardData() {
      try {
        const [cards, transactions] = await Promise.all([getUserCards(), fetchUserTransactions()]);

        console.log('Fetched Cards:', cards);
        console.log('Fetched Transactions:', transactions);

        // Create a map to store total spending per category
        const categorySpendingMap = new Map();

        // Calculate total spending per category from transactions
        transactions.forEach((transaction) => {
          const { cardId, amount, category } = transaction;
          const card = cards.find((c) => c.id === cardId);
          if (card && card.categoryName) {
            const currentTotal = categorySpendingMap.get(card.categoryName) || 0;
            categorySpendingMap.set(card.categoryName, currentTotal + Number(amount));
          }
        });

        console.log('Category Spending Map:', Object.fromEntries(categorySpendingMap));

        // Filter for category-locked cards and group by category
        const topSpendersByCategory = cards.reduce((acc, card) => {
          console.log('Processing card:', card);
          // Map the backend category names to our frontend categories if needed
          const categoryMapping = {
            GROCERIES: 'FOOD',
            FURNITURE: 'SHOPPING',
            // Add other mappings as needed
          };

          if (!card.closed && card.categoryName) {
            const frontendCategory = categoryMapping[card.categoryName] || card.categoryName;
            if (CATEGORIES.includes(frontendCategory)) {
              const totalSpent = categorySpendingMap.get(card.categoryName) || 0;
              console.log(`Card ${card.cardName} for category ${frontendCategory} spent ${totalSpent}`);

              if (!acc[frontendCategory] || totalSpent > (acc[frontendCategory].totalSpent || 0)) {
                acc[frontendCategory] = {
                  name: card.cardName,
                  category: frontendCategory,
                  totalSpent: totalSpent,
                  cardIcon: card.cardIcon || DEFAULT_CATEGORY_EMOJIS[frontendCategory] || '💳',
                };
              }
            }
          }
          return acc;
        }, {});

        console.log('Top Spenders by Category:', topSpendersByCategory);

        // Merge with defaults, keeping existing cards and adding defaults for missing categories
        setTopCards((prevCards) => {
          const updatedCards = { ...prevCards };
          Object.entries(topSpendersByCategory).forEach(([category, card]) => {
            if (CATEGORIES.includes(category)) {
              updatedCards[category] = card;
            }
          });
          console.log('Final Cards State:', updatedCards);
          return updatedCards;
        });
      } catch (error) {
        console.error('Error fetching card and transaction data:', error);
      }
    }

    fetchCardData();
  }, []);

  useEffect(() => {
    // Title appears immediately
    const titleAppear = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);

    // Emojis appear one by one starting at 3.5 seconds
    const emojiAppearTimeouts = emojiOpacities.map((opacity, index) => {
      return setTimeout(() => {
        opacity.value = withTiming(1, { duration: 300 });
      }, 3500 + index * 200);
    });

    // Names appear one by one starting at 5 seconds
    const nameAppearTimeouts = nameOpacities.map((opacity, index) => {
      return setTimeout(() => {
        opacity.value = withTiming(1, { duration: 300 });
        // Switch to category after 1 second
        setTimeout(() => {
          nameOpacities[index].value = withTiming(0, { duration: 300 });
          setTimeout(() => {
            categoryOpacities[index].value = withTiming(1, { duration: 300 });
          }, 300);
        }, 2500);
      }, 5000 + index * 200);
    });

    // Start disappearing one by one at 9.5 seconds
    const disappearTimeouts = SQUARE_POSITIONS.map((_, index) => {
      return setTimeout(() => {
        // Fade out category first
        categoryOpacities[index].value = withTiming(0, { duration: 300 });
        // Fade out emoji 200ms later
        setTimeout(() => {
          emojiOpacities[index].value = withTiming(0, { duration: 300 });
        }, 200);
      }, 9500 + index * 400);
    });

    // Title disappears last
    const titleDisappear = setTimeout(() => {
      titleOpacity.value = withTiming(0, { duration: 500 });
    }, 12000);

    return () => {
      clearTimeout(titleAppear);
      clearTimeout(titleDisappear);
      emojiAppearTimeouts.forEach(clearTimeout);
      nameAppearTimeouts.forEach(clearTimeout);
      disappearTimeouts.forEach(clearTimeout);
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide5.MP4')} />

      {/* Main Title */}
      <AnimatedText
        pos="absolute"
        t="45%"
        l={0}
        r={0}
        fontFamily="$archivoBlack"
        fontSize="$8"
        color="$white"
        textAlign="center"
        textShadowRadius={5}
        style={titleStyle}
      >
        TOP SPENDERS BY CATEGORY
      </AnimatedText>

      {/* Squares with Emojis and Names/Categories */}
      {SQUARE_POSITIONS.map((position, index) => {
        const category = CATEGORIES[index];
        const card = topCards[category] || { name: 'No Card', category: category, cardIcon: '💳' };
        const isNameBelow = index === 1 || index === 3;

        return (
          <View key={index} pos="absolute" {...position}>
            <YStack ai="center" jc="center">
              {/* Text Above */}
              {!isNameBelow && (
                <YStack ai="center" w="100%">
                  <AnimatedText
                    fontFamily="$archivoBlack"
                    fontSize="$5"
                    color="$white"
                    textAlign="center"
                    mb="$6"
                    textShadowRadius={5}
                    w="100%"
                    style={[
                      useAnimatedStyle(() => ({
                        opacity: nameOpacities[index].value,
                      })),
                      {
                        transform: [{ rotate: position.rotate }],
                      },
                    ]}
                  >
                    {card.name}
                  </AnimatedText>
                  <AnimatedText
                    fontFamily="$archivoBlack"
                    fontSize="$5"
                    color="$white"
                    mb="$6"
                    textAlign="center"
                    w={200}
                    textShadowRadius={5}
                    style={[
                      useAnimatedStyle(() => ({
                        opacity: categoryOpacities[index].value,
                      })),
                      {
                        transform: [{ rotate: position.rotate }],
                        position: 'absolute',
                      },
                    ]}
                  >
                    {card.category}
                  </AnimatedText>
                </YStack>
              )}

              {/* Emoji */}
              <AnimatedView
                w={60}
                h={60}
                ai="center"
                jc="center"
                style={useAnimatedStyle(() => ({
                  opacity: emojiOpacities[index].value,
                }))}
              >
                <Text opacity={0.8} fontSize={48}>
                  {card.cardIcon}
                </Text>
              </AnimatedView>

              {/* Text Below */}
              {isNameBelow && (
                <YStack ai="center" w="100%">
                  <AnimatedText
                    fontFamily="$archivoBlack"
                    fontSize="$5"
                    color="$white"
                    mt="$8"
                    textAlign="center"
                    textShadowRadius={5}
                    style={[
                      useAnimatedStyle(() => ({
                        opacity: nameOpacities[index].value,
                      })),
                      {
                        transform: [{ rotate: position.rotate }],
                      },
                    ]}
                  >
                    {card.name}
                  </AnimatedText>
                  <AnimatedText
                    fontFamily="$archivoBlack"
                    fontSize="$5"
                    color="$white"
                    w={200}
                    mt="$8"
                    textAlign="center"
                    textShadowRadius={5}
                    style={[
                      useAnimatedStyle(() => ({
                        opacity: categoryOpacities[index].value,
                      })),
                      {
                        transform: [{ rotate: position.rotate }],
                        position: 'absolute',
                      },
                    ]}
                  >
                    {card.category}
                  </AnimatedText>
                </YStack>
              )}
            </YStack>
          </View>
        );
      })}
    </YStack>
  );
}
