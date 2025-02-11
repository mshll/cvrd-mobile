import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useColors } from '@/config/colors';
import { XStack } from 'tamagui';
import { Portal } from '@gorhom/portal';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IntroStory,
  TotalSpentStory,
  BiggestMonthStory,
  HighestPurchaseStory,
  TopMerchantStory,
  TopLocationStory,
  TopCategoryStory,
  OutroStory,
} from './playback';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per story
const NUM_STORIES = 8;
const DISMISS_THRESHOLD = 150; // pixels to slide down before dismissing

export function SpendingRecapStory({ isVisible, onClose, spendingData }) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [currentStory, setCurrentStory] = useState(0);
  const [progressValues, setProgressValues] = useState(Array(NUM_STORIES).fill(0));

  // Animation values
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  // Reset when opening
  useEffect(() => {
    if (isVisible) {
      setCurrentStory(0);
      setProgressValues(Array(NUM_STORIES).fill(0));
      translateY.value = 0;
    }
  }, [isVisible]);

  // Handle progress animation for current story
  useEffect(() => {
    if (!isVisible) return;

    // Complete all previous stories
    setProgressValues((prev) => {
      const newValues = [...prev];
      for (let i = 0; i < currentStory; i++) {
        newValues[i] = 100;
      }
      return newValues;
    });

    const interval = setInterval(() => {
      setProgressValues((prev) => {
        const newValues = [...prev];
        if (newValues[currentStory] < 100) {
          newValues[currentStory] += 2;
        }
        return newValues;
      });
    }, STORY_DURATION / 50);

    const timeout = setTimeout(() => {
      if (currentStory < NUM_STORIES - 1) {
        setCurrentStory((prev) => prev + 1);
      } else {
        setCurrentStory(0);
        setProgressValues(Array(NUM_STORIES).fill(0));
        onClose();
      }
    }, STORY_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentStory, isVisible]);

  const handleDismiss = useCallback(() => {
    setCurrentStory(0);
    setProgressValues(Array(NUM_STORIES).fill(0));
    onClose();
  }, [onClose]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Only allow downward movement or moving back up to original position
      if (event.translationY >= 0 || translateY.value > 0) {
        translateY.value = event.translationY + context.value.y;
      }
    })
    .onEnd((event) => {
      if (translateY.value > DISMISS_THRESHOLD) {
        // Quickly animate the story off-screen
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 150 }, () => {
          runOnJS(handleDismiss)();
        });
      } else {
        // Spring back to original position
        translateY.value = withSpring(0);
      }
    });

  const handlePress = useCallback(
    (e) => {
      // Only handle taps if not being dragged
      if (translateY.value === 0) {
        const x = e.nativeEvent.locationX;
        if (x < SCREEN_WIDTH / 2) {
          // Pressed left side
          if (currentStory > 0) {
            setCurrentStory((prev) => prev - 1);
            setProgressValues((prev) => {
              const newValues = [...prev];
              // Reset current and next stories' progress
              newValues[currentStory] = 0;
              newValues[currentStory - 1] = 0;
              return newValues;
            });
          }
        } else {
          // Pressed right side
          if (currentStory < NUM_STORIES - 1) {
            // Complete current story instantly
            setProgressValues((prev) => {
              const newValues = [...prev];
              newValues[currentStory] = 100;
              return newValues;
            });
            setCurrentStory((prev) => prev + 1);
          } else {
            handleDismiss();
          }
        }
      }
    },
    [currentStory, handleDismiss]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateY.value, [0, SCREEN_HEIGHT], [1, 0.9], Extrapolate.CLAMP);
    return {
      transform: [{ translateY: translateY.value }, { scale }],
    };
  });

  const renderStoryContent = () => {
    switch (currentStory) {
      case 0:
        return <IntroStory />;
      case 1:
        return <TotalSpentStory totalSpent={spendingData?.totalSpent} />;
      case 2:
        return (
          <BiggestMonthStory
            biggestMonth={spendingData?.biggestMonth}
            biggestMonthAmount={spendingData?.biggestMonthAmount}
          />
        );
      case 3:
        return (
          <HighestPurchaseStory
            highestPurchase={spendingData?.highestPurchase}
            highestPurchaseMerchant={spendingData?.highestPurchaseMerchant}
          />
        );
      case 4:
        return (
          <TopMerchantStory
            topMerchant={spendingData?.topMerchant}
            topMerchantVisits={spendingData?.topMerchantVisits}
          />
        );
      case 5:
        return (
          <TopLocationStory
            topLocation={spendingData?.topLocation}
            topLocationAmount={spendingData?.topLocationAmount}
          />
        );
      case 6:
        return (
          <TopCategoryStory
            topCategory={spendingData?.topCategory}
            topCategoryAmount={spendingData?.topCategoryAmount}
          />
        );
      case 7:
        return <OutroStory />;
    }
  };

  if (!isVisible) {
    translateY.value = 0;
    return null;
  }

  return (
    <Portal>
      <View style={[styles.container, { backgroundColor: colors.background, marginTop: insets.top }]}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}>
              <Pressable style={styles.touchArea} onPress={handlePress}>
                {/* Story Content */}
                <View style={styles.content}>{renderStoryContent()}</View>

                {/* Progress Indicators - Moved after content */}
                <View style={styles.progressContainer}>
                  <XStack gap={4} p={16}>
                    {progressValues.map((progress, index) => (
                      <View key={index} style={styles.progressBarWrapper}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${progress}%`,
                              backgroundColor: colors.primary,
                            },
                          ]}
                        />
                      </View>
                    ))}
                  </XStack>
                </View>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999, // for Android
  },
  touchArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  progressBarWrapper: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 1,
  },
});
