import React, { useEffect, useState } from 'react';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, View } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { getUserCards } from '@/api/cards';
import { CARD_DEFAULTS } from '@/api/cards';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedView = Animated.createAnimatedComponent(View);

// Placeholder positions for the squares - you can adjust these
const SQUARE_POSITIONS = [
  { top: '35%', left: '20%', rotate: '-15deg' },
  { top: '35%', left: '50%', rotate: '10deg' },
  { top: '55%', left: '35%', rotate: '-5deg' },
  { top: '55%', left: '65%', rotate: '15deg' },
];

const CARD_TYPES = ['BURNER', 'MERCHANT_LOCKED', 'CATEGORY_LOCKED', 'LOCATION_LOCKED'];

export function Slide5Story() {
  const colors = Colors;
  const [topCards, setTopCards] = useState(
    CARD_TYPES.reduce(
      (acc, type) => ({
        ...acc,
        [type]: { name: '', emoji: CARD_DEFAULTS[type]?.cardIcon || '💳' },
      }),
      {}
    )
  );

  // Animation values
  const titleOpacity = useSharedValue(0);
  const emojiOpacities = SQUARE_POSITIONS.map(() => useSharedValue(0));
  const nameOpacities = SQUARE_POSITIONS.map(() => useSharedValue(0));

  useEffect(() => {
    async function fetchCardData() {
      try {
        const cards = await getUserCards();

        // Group cards by type and find the one with highest totalSpent in each category
        const topSpendersByType = cards.reduce((acc, card) => {
          if (!card.closed && card.cardType) {
            const totalSpent = Number(card.totalSpent) || 0;
            if (!acc[card.cardType] || totalSpent > (acc[card.cardType].totalSpent || 0)) {
              acc[card.cardType] = {
                name: card.cardName,
                totalSpent: totalSpent,
                emoji: CARD_DEFAULTS[card.cardType]?.cardIcon || '💳',
              };
            }
          }
          return acc;
        }, {});

        setTopCards((prevCards) => ({
          ...prevCards,
          ...topSpendersByType,
        }));
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    }

    fetchCardData();
  }, []);

  useEffect(() => {
    // Title appears at 2 seconds
    const titleAppear = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);

    // Emojis appear at 6 seconds
    const emojiAppear = setTimeout(() => {
      emojiOpacities.forEach((opacity, index) => {
        setTimeout(() => {
          opacity.value = withTiming(1, { duration: 300 });
        }, index * 200);
      });
    }, 5000);

    // Names appear at 7 seconds
    const namesAppear = setTimeout(() => {
      nameOpacities.forEach((opacity, index) => {
        setTimeout(() => {
          opacity.value = withTiming(1, { duration: 300 });
        }, index * 200);
      });
    }, 7000);

    return () => {
      clearTimeout(titleAppear);
      clearTimeout(emojiAppear);
      clearTimeout(namesAppear);
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
        t="48%"
        l={0}
        r={0}
        fontFamily="$archivoBlack"
        fontSize="$8"
        color="$white"
        textAlign="center"
        textShadowRadius={5}
        style={titleStyle}
      >
        TOP SPENDERS
      </AnimatedText>

      {/* Squares with Emojis and Names */}
      {SQUARE_POSITIONS.map((position, index) => {
        const cardType = CARD_TYPES[index];
        const card = topCards[cardType] || { name: 'No Card', emoji: '💳' };

        return (
          <View key={index} pos="absolute" {...position}>
            {/* Card Name */}
            <AnimatedText
              pos="absolute"
              t="-24px"
              l={0}
              r={0}
              fontFamily="$archivoBlack"
              fontSize="$5"
              color="$white"
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
              {card.name || 'No Card'}
            </AnimatedText>

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
              <Text fontSize={32}>{card.emoji}</Text>
            </AnimatedView>
          </View>
        );
      })}
    </YStack>
  );
}
