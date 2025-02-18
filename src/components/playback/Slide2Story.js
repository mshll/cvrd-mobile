import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, XStack } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { getUserCards } from '@/api/cards';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export function Slide2Story() {
  const colors = Colors;
  const [cardCounts, setCardCounts] = useState({
    total: 0,
    merchant: 0,
    burner: 0,
    location: 0,
    category: 0,
  });

  // Fetch card data when component mounts
  useEffect(() => {
    async function fetchCardData() {
      try {
        const cards = await getUserCards();
        const counts = cards.reduce(
          (acc, card) => {
            acc.total++;
            switch (card.cardType) {
              case 'MERCHANT_LOCKED':
                acc.merchant++;
                break;
              case 'BURNER':
                acc.burner++;
                break;
              case 'LOCATION_LOCKED':
                acc.location++;
                break;
              case 'CATEGORY_LOCKED':
                acc.category++;
                break;
            }
            return acc;
          },
          { total: 0, merchant: 0, burner: 0, location: 0, category: 0 }
        );

        setCardCounts(counts);
      } catch (error) {
        console.log('Error fetching card data:', error);
      }
    }

    fetchCardData();
  }, []);

  const LIST_ITEMS = [
    { number: cardCounts.merchant.toString(), text: 'MERCHANT', color: colors.cards.red },
    { number: cardCounts.burner.toString(), text: 'BURNER', color: colors.cards.pink },
    { number: cardCounts.location.toString(), text: 'LOCATION', color: colors.cards.green },
    { number: cardCounts.category.toString(), text: 'CATEGORY', color: colors.cards.yellow },
  ];

  const firstLineOpacity = useSharedValue(0);
  const secondLineOpacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const listOpacities = LIST_ITEMS.map(() => useSharedValue(0));

  useEffect(() => {
    const firstLineIn = setTimeout(() => {
      firstLineOpacity.value = withTiming(1, { duration: 500 });
    }, 3000);

    const secondLineIn = setTimeout(() => {
      secondLineOpacity.value = withTiming(1, { duration: 500 });
    }, 3500);

    const moveUp = setTimeout(() => {
      translateY.value = withTiming(-200, { duration: 1000 });
    }, 7000);

    // Animate list items
    LIST_ITEMS.forEach((_, index) => {
      setTimeout(() => {
        listOpacities[index].value = withTiming(1, { duration: 400 });
      }, 10000 + index * 500);
    });

    return () => {
      clearTimeout(firstLineIn);
      clearTimeout(secondLineIn);
      clearTimeout(moveUp);
    };
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const firstLineStyle = useAnimatedStyle(() => ({
    opacity: firstLineOpacity.value,
  }));

  const secondLineStyle = useAnimatedStyle(() => ({
    opacity: secondLineOpacity.value,
  }));

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide2.MP4')} />
      <AnimatedYStack pos="absolute" t="40%" l={0} r={0} ai="center" style={containerStyle}>
        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$8"
          color="white"
          textAlign="center"
          textShadowRadius={5}
          style={firstLineStyle}
        >
          YOU GENERATED
        </AnimatedText>
        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$12"
          color="white"
          textAlign="center"
          textShadowRadius={5}
          style={secondLineStyle}
        >
          {cardCounts.total} CARDS
        </AnimatedText>
      </AnimatedYStack>

      <YStack pos="absolute" b="15%" l={0} r={0} ai="center" gap="$4">
        {LIST_ITEMS.map((item, index) => (
          <AnimatedText
            key={item.text}
            fontFamily="$archivoBlack"
            fontSize="$6"
            mt="$2"
            textAlign="center"
            textShadowRadius={5}
            style={useAnimatedStyle(() => ({
              opacity: listOpacities[index].value,
            }))}
          >
            <Text color={item.color} fontFamily="$archivoBlack" fontSize="$10">
              {item.number}
            </Text>{' '}
            <Text color="white" fontFamily="$archivoBlack" fontSize="$6">
              {item.text}
            </Text>
          </AnimatedText>
        ))}
      </YStack>
    </YStack>
  );
}
