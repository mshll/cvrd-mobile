import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { getUserCards } from '@/api/cards';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export function Slide3Story() {
  const colors = Colors;
  const [topCards, setTopCards] = useState([
    { text: 'Loading...', amount: 0, color: colors.cards.white },
    { text: 'Loading...', amount: 0, color: colors.cards.white },
    { text: 'Loading...', amount: 0, color: colors.cards.white },
  ]);
  const [topSpender, setTopSpender] = useState({
    text: 'Loading...',
    amount: 0,
    color: colors.cards.navy,
  });

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(0);
  const bottomTextOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const listOpacities = topCards.map(() => useSharedValue(0));

  // Fetch and process card data when component mounts
  useEffect(() => {
    async function fetchCardData() {
      try {
        const cards = await getUserCards();

        // Filter active cards and ensure totalSpent is a number
        const activeCards = cards
          .filter((card) => !card.closed)
          .map((card) => ({
            ...card,
            totalSpent: Number(card.totalSpent) || 0,
          }));

        // Sort cards by total spent
        const sortedCards = activeCards.sort((a, b) => b.totalSpent - a.totalSpent);

        // If we have no cards, keep the loading state
        if (sortedCards.length === 0) return;

        // Set top spender (first card)
        const firstCard = sortedCards[0];
        setTopSpender({
          text: firstCard.cardName || 'Unnamed Card',
          amount: firstCard.totalSpent,
          color: firstCard.cardColor || colors.cards.navy,
        });

        // For remaining cards, if we have less than 3, we'll show what we have
        const remainingCards = sortedCards.slice(1);
        const displayCards = remainingCards.map((card) => ({
          text: card.cardName || 'Unnamed Card',
          amount: card.totalSpent,
          color: card.cardColor || colors.cards.gray,
        }));

        // If we have less than 3 remaining cards, add placeholder cards
        const placeholderColors = [colors.cards.white, colors.cards.white, colors.cards.white];
        let colorIndex = 0;
        while (displayCards.length < 3) {
          displayCards.push({
            text: 'None',
            amount: 0,
            color: placeholderColors[colorIndex % placeholderColors.length],
          });
          colorIndex++;
        }

        setTopCards(displayCards.slice(0, 3));
      } catch (error) {
        console.log('Error fetching card data:', error);
        // Set default values in case of error
        setTopSpender({
          text: 'No Data Available',
          amount: 0,
          color: colors.cards.navy,
        });
        setTopCards([
          { text: 'None', amount: 0, color: colors.cards.white },
          { text: 'None', amount: 0, color: colors.cards.white },
          { text: 'None', amount: 0, color: colors.cards.white },
        ]);
      }
    }

    fetchCardData();
  }, []);

  useEffect(() => {
    // Title appears at 2 seconds
    const titleAppear = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);

    // Title moves up at 3 seconds
    const titleMoveUp = setTimeout(() => {
      titleTranslateY.value = withTiming(-280, { duration: 1100 });
    }, 2250);

    // Bottom text appears at 7 seconds
    const subtitleAppear = setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 200 });
    }, 4000);

    const subtitleDisappear = setTimeout(() => {
      subtitleOpacity.value = withTiming(0, { duration: 200 });
    }, 6000);

    const bottomTextAppear = setTimeout(() => {
      bottomTextOpacity.value = withTiming(1, { duration: 500 });
    }, 7000);

    // List items appear one by one starting at 10 seconds
    listOpacities.forEach((opacity, index) => {
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 400 });
      }, 10000 + index * 500);
    });

    return () => {
      clearTimeout(titleAppear);
      clearTimeout(titleMoveUp);
      clearTimeout(subtitleAppear);
      clearTimeout(subtitleDisappear);
      clearTimeout(bottomTextAppear);
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const bottomTextStyle = useAnimatedStyle(() => ({
    opacity: bottomTextOpacity.value,
    transform: [{ rotate: '-8deg' }],
  }));

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide3.MP4')} />

      {/* Main Title */}
      <AnimatedYStack pos="absolute" t="43%" l={0} r={0} ai="center" style={titleStyle}>
        <AnimatedText fontFamily="$archivoBlack" fontSize="$8" color="$white" textAlign="center" textShadowRadius={5}>
          YOUR MOST LOVED CARDS
        </AnimatedText>
      </AnimatedYStack>

      {/* Center List */}
      <YStack pos="absolute" t="50%" l={0} r={0} ai="center" gap="$5">
        {topCards.map((card, index) => (
          <AnimatedText
            key={index}
            fontFamily="$archivoBlack"
            fontSize="$6"
            mt="$3.5"
            textAlign="center"
            textShadowRadius={5}
            style={useAnimatedStyle(() => ({
              opacity: listOpacities[index].value,
            }))}
          >
            <Text color="$white" fontFamily="$archivoBlack" fontSize="$6">
              {index + 2}. {card.text}
            </Text>
            <Text color="$white" fontFamily="$archivoBlack" fontSize="$5">
              {' '}
              • {card.amount} KD
            </Text>
          </AnimatedText>
        ))}
      </YStack>

      {/* Subtitle - "YOU WERE SWIPING!" */}
      <AnimatedText
        pos="absolute"
        b="20%"
        l={0}
        r={0}
        fontFamily="$archivoBlack"
        fontSize="$6"
        textAlign="center"
        textShadowRadius={5}
        color="$white"
        style={subtitleStyle}
      >
        YOU WERE SWIPING!
      </AnimatedText>

      {/* Bottom Text - Top Spender */}
      <AnimatedText
        pos="absolute"
        b="6%"
        l={0}
        r={0}
        fontFamily="$archivoBlack"
        fontSize="$6"
        textAlign="center"
        textShadowRadius={5}
        style={bottomTextStyle}
      >
        <Text color="$white" fontFamily="$archivoBlack" fontSize="$6">
          1. {topSpender.text}
        </Text>
        <Text color="$white" fontFamily="$archivoBlack" fontSize="$5">
          {' '}
          • {topSpender.amount} KD
        </Text>
      </AnimatedText>
    </YStack>
  );
}
