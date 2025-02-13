import React, { useEffect } from 'react';
import { View } from 'react-native';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, XStack } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export function Slide2Story() {
  const colors = Colors;

  const LIST_ITEMS = [
    { number: '48', text: 'MERCHANT', color: colors.cards.red },
    { number: '35', text: 'BURNER', color: colors.cards.pink },
    { number: '22', text: 'LOCATION', color: colors.cards.green },
    { number: '19', text: 'CATEGORY', color: colors.cards.navy },
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
          color="$white"
          textAlign="center"
          // textShadowColor="rgba(0, 0, 0, 0.75)"
          // textShadowOffset={{ width: 2, height: 2 }}
          textShadowRadius={5}
          style={firstLineStyle}
        >
          YOU GENERATED
        </AnimatedText>
        <AnimatedText
          fontFamily="$archivoBlack"
          fontSize="$12"
          color="$white"
          textAlign="center"
          textShadowRadius={5}
          style={secondLineStyle}
        >
          124 CARDS
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
            <Text color="$white" fontFamily="$archivoBlack" fontSize="$6">
              {item.text}
            </Text>
          </AnimatedText>
        ))}
      </YStack>
    </YStack>
  );
}
