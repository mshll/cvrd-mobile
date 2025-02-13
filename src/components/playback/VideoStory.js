import React, { useRef, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { useColors } from '@/config/colors';
import { useCardStats } from '@/hooks/useCardStats';
import { YStack } from 'tamagui';
import Animated, { useAnimatedStyle, withDelay, withTiming, useSharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedText = Animated.createAnimatedComponent(Text);

export function VideoStory({ videoSource }) {
  const video = useRef(null);
  const colors = useColors();
  const { stats, loading, error } = useCardStats();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const totalOpacity = useSharedValue(0);
  const merchantOpacity = useSharedValue(0);
  const burnerOpacity = useSharedValue(0);
  const locationOpacity = useSharedValue(0);
  const categoryOpacity = useSharedValue(0);

  useEffect(() => {
    if (video.current) {
      video.current.playAsync();
    }

    // Start animations
    const animationConfig = { duration: 800 };
    titleOpacity.value = withDelay(500, withTiming(1, animationConfig));
    totalOpacity.value = withDelay(1500, withTiming(1, animationConfig));
    merchantOpacity.value = withDelay(2500, withTiming(1, animationConfig));
    burnerOpacity.value = withDelay(3000, withTiming(1, animationConfig));
    locationOpacity.value = withDelay(3500, withTiming(1, animationConfig));
    categoryOpacity.value = withDelay(4000, withTiming(1, animationConfig));

    return () => {
      if (video.current) {
        video.current.stopAsync();
      }
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: withTiming(titleOpacity.value * 0, { duration: 500 }) }],
  }));

  const totalStyle = useAnimatedStyle(() => ({
    opacity: totalOpacity.value,
    transform: [{ translateY: withTiming(totalOpacity.value * 0, { duration: 500 }) }],
  }));

  const merchantStyle = useAnimatedStyle(() => ({
    opacity: merchantOpacity.value,
    transform: [{ translateY: withTiming(merchantOpacity.value * 0, { duration: 500 }) }],
  }));

  const burnerStyle = useAnimatedStyle(() => ({
    opacity: burnerOpacity.value,
    transform: [{ translateY: withTiming(burnerOpacity.value * 0, { duration: 500 }) }],
  }));

  const locationStyle = useAnimatedStyle(() => ({
    opacity: locationOpacity.value,
    transform: [{ translateY: withTiming(locationOpacity.value * 0, { duration: 500 }) }],
  }));

  const categoryStyle = useAnimatedStyle(() => ({
    opacity: categoryOpacity.value,
    transform: [{ translateY: withTiming(categoryOpacity.value * 0, { duration: 500 }) }],
  }));

  const renderContent = () => {
    if (loading) {
      return (
        <YStack space="$4" ai="center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.stat, { color: colors.text }]}>Loading stats...</Text>
        </YStack>
      );
    }

    if (error) {
      return (
        <YStack space="$4" ai="center">
          <Text style={[styles.stat, { color: colors.error }]}>Failed to load stats</Text>
        </YStack>
      );
    }

    return (
      <YStack space="$4" ai="center">
        <AnimatedText style={[styles.title, { color: colors.text }, titleStyle]}>You Generated</AnimatedText>
        <AnimatedText style={[styles.stat, { color: colors.text, fontSize: 32 }, totalStyle]}>
          {stats.total} Cards
        </AnimatedText>
        <AnimatedText style={[styles.stat, { color: colors.text }, merchantStyle]}>
          {stats.merchant} Merchant Cards
        </AnimatedText>
        <AnimatedText style={[styles.stat, { color: colors.text }, burnerStyle]}>
          {stats.burner} Burner Cards
        </AnimatedText>
        <AnimatedText style={[styles.stat, { color: colors.text }, locationStyle]}>
          {stats.location} Location Cards
        </AnimatedText>
        <AnimatedText style={[styles.stat, { color: colors.text }, categoryStyle]}>
          {stats.category} Category Cards
        </AnimatedText>
      </YStack>
    );
  };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={videoSource}
        style={styles.video}
        resizeMode="cover"
        isLooping={false}
        shouldPlay
        isMuted={false}
      />
      <View style={[styles.overlay, { backgroundColor: colors.backgroundTransparent }]}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stat: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
