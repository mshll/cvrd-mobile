import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { YStack } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PROGRESS_PADDING = 16;
const PROGRESS_HEIGHT = 32; // Account for progress bar height and padding

export function IntroStory() {
  const colors = useColors();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const morphProgress = useSharedValue(0);

  // Constants for sizing - based on screen width
  const CONTAINER_SIZE = SCREEN_WIDTH * 0.5; // 50% of screen width
  const PLAY_HEIGHT = CONTAINER_SIZE * 0.6; // 60% of container
  const PAUSE_BAR_WIDTH = PLAY_HEIGHT * 0.35; // 35% of play height for thicker bars
  const PAUSE_BAR_SPACING = PAUSE_BAR_WIDTH * 1.2; // 1.2x the bar width for closer spacing
  const TRIANGLE_BASE = PLAY_HEIGHT * 0.6; // 60% of play height
  const USABLE_HEIGHT = SCREEN_HEIGHT - (PROGRESS_PADDING * 2 + PROGRESS_HEIGHT); // Height minus progress area

  useEffect(() => {
    // Initial animation - pop up
    scale.value = withDelay(
      300,
      withSpring(1, {
        damping: 8,
        stiffness: 100,
        mass: 0.5,
      })
    );
    opacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 400,
      })
    );

    // Morph animation after initial appearance
    const timeout = setTimeout(() => {
      morphProgress.value = withSequence(
        withTiming(0.2, { duration: 400 }), // Just rotate triangle in place
        withTiming(0.5, { duration: 300 }), // Morph to square
        withTiming(0.6, { duration: 300 }), // Split into two bars
        withTiming(0.7, { duration: 300 }), // Start extending
        withTiming(0.9, { duration: 600 }), // Slower extension to full height
        withDelay(
          500, // Pause before rotation
          withTiming(1, { duration: 600 }) // Slower rotation to 45 degrees
        )
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const playPauseStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      morphProgress.value,
      [0, 0.5, 0.6, 1],
      [0, 0, -PAUSE_BAR_SPACING, -PAUSE_BAR_SPACING],
      Extrapolate.CLAMP
    );

    const width = interpolate(
      morphProgress.value,
      [0, 0.5, 0.6, 1],
      [0, PLAY_HEIGHT, PAUSE_BAR_WIDTH, PAUSE_BAR_WIDTH],
      Extrapolate.CLAMP
    );

    const height = interpolate(
      morphProgress.value,
      [0, 0.5, 0.6, 0.7, 0.9, 1],
      [0, PLAY_HEIGHT, PLAY_HEIGHT, PLAY_HEIGHT, USABLE_HEIGHT, USABLE_HEIGHT],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      morphProgress.value,
      [0, 0.7, 1],
      [0, 0, -PROGRESS_HEIGHT], // Move up to compensate for progress bar space
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      morphProgress.value,
      [0, 0.2], // Only rotate during first phase
      [90, 0],
      Extrapolate.CLAMP
    );

    const triangleScale = interpolate(
      morphProgress.value,
      [0.2, 0.5], // Morph triangle to square after rotation
      [1, 0],
      Extrapolate.CLAMP
    );

    const finalRotate = interpolate(morphProgress.value, [0.9, 1], [0, 45], Extrapolate.CLAMP);

    return {
      width,
      height,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: TRIANGLE_BASE * triangleScale,
      borderRightWidth: TRIANGLE_BASE * triangleScale,
      borderBottomWidth: PLAY_HEIGHT * triangleScale,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.primary,
      backgroundColor: interpolate(morphProgress.value, [0.2, 0.5, 1], [0, 1, 1], Extrapolate.CLAMP)
        ? colors.primary
        : 'transparent',
      borderRadius: 0,
      transform: [{ translateX }, { translateY }, { rotate: `${rotate}deg` }, { rotate: `${finalRotate}deg` }],
    };
  });

  const rightBarStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      morphProgress.value,
      [0.5, 0.6, 1],
      [0, PAUSE_BAR_SPACING, PAUSE_BAR_SPACING],
      Extrapolate.CLAMP
    );

    const width = interpolate(
      morphProgress.value,
      [0.5, 0.51, 0.6, 1],
      [0, PLAY_HEIGHT, PAUSE_BAR_WIDTH, PAUSE_BAR_WIDTH],
      Extrapolate.CLAMP
    );

    const height = interpolate(
      morphProgress.value,
      [0.5, 0.6, 0.7, 0.9, 1],
      [PLAY_HEIGHT, PLAY_HEIGHT, PLAY_HEIGHT, USABLE_HEIGHT, USABLE_HEIGHT],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      morphProgress.value,
      [0, 0.7, 1],
      [0, 0, -PROGRESS_HEIGHT], // Move up to compensate for progress bar space
      Extrapolate.CLAMP
    );

    const finalRotate = interpolate(morphProgress.value, [0.9, 1], [0, 45], Extrapolate.CLAMP);

    return {
      position: 'absolute',
      width,
      height,
      backgroundColor: colors.primary,
      borderRadius: 0,
      opacity: interpolate(morphProgress.value, [0.5, 0.51, 1], [0, 1, 1], Extrapolate.CLAMP),
      transform: [{ translateX }, { translateY }, { rotate: `${finalRotate}deg` }],
    };
  });

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <Animated.View style={[{ width: CONTAINER_SIZE, height: USABLE_HEIGHT }, containerStyle]}>
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View style={playPauseStyle} />
          <Animated.View style={rightBarStyle} />
        </View>
      </Animated.View>
    </YStack>
  );
}
