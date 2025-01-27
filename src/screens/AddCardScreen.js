import { Colors } from '@/config/colors';
import { View } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
  Easing,
  withDelay,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import { useEffect, useState, useCallback, memo } from 'react';
import { Dimensions } from 'react-native';
import AddCardComponent from '@/components/AddCardComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const WINDOW_HEIGHT = window.height;
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);
const CIRCLE_SIZE = 60;
const START_TOP = 100;
const BOTTOM_NAV_HEIGHT = 80;
const CARD_SPACING = 20;

const SAMPLE_CARDS = [
  {
    id: '1',
    type: 'Burner',
    label: 'Quick Pay',
    emoji: '🔥',
    color: 'pink',
    title: 'Single-Use',
  },
  {
    id: '2',
    type: 'Merchant',
    label: 'Shopping',
    emoji: '🛍️',
    color: 'green',
    title: 'Merchant-Locked',
  },
  {
    id: '3',
    type: 'Location',
    label: 'Travel',
    emoji: '✈️',
    color: 'blue',
    title: 'Location-Locked',
  },
  {
    id: '4',
    type: 'Category',
    label: 'Monthly',
    emoji: '📅',
    color: 'yellow',
    title: 'Category-Locked',
  },
];

const springConfig = {
  damping: 15,
  stiffness: 60,
  mass: 1,
};

const liquidSpring = {
  damping: 12,
  stiffness: 30,
  mass: 0.8,
};

const CarouselCard = memo(({ item, index, scrollX, showCarousel }) => {
  const centerIndex = 1;

  const cardStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + CARD_SPACING),
      index * (CARD_WIDTH + CARD_SPACING),
      (index + 1) * (CARD_WIDTH + CARD_SPACING),
    ];

    const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], 'clamp');

    const translateY = interpolate(scrollX.value, inputRange, [30, 0, 30], 'clamp');

    const slideOut = index === centerIndex ? 0 : index < centerIndex ? -CARD_WIDTH : CARD_WIDTH;

    const translateX = showCarousel ? withSpring(0, { damping: 15, stiffness: 40 }) : slideOut;

    // Both center and side cards start hidden
    let opacity = 0;

    if (index === centerIndex) {
      // Center card appears first when showCarousel becomes true
      opacity = showCarousel ? withSpring(1, { damping: 8, stiffness: 50 }) : 0;
    } else {
      // Side cards appear with a delay after center card
      opacity = showCarousel ? withDelay(200, withSpring(1, { damping: 12, stiffness: 35 })) : 0;
    }

    return {
      transform: [{ scale }, { translateY }, { translateX }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: CARD_WIDTH,
          marginHorizontal: CARD_SPACING / 2,
        },
        cardStyle,
      ]}
    >
      <AddCardComponent type={item.type} label={item.label} emoji={item.emoji} color={item.color} />
    </Animated.View>
  );
});

const AnimatedTitle = memo(({ scrollX }) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: -80,
        left: 0,
        right: 0,
        height: 40,
        justifyContent: 'center',
      }}
    >
      {SAMPLE_CARDS.map((card, index) => {
        const titleStyle = useAnimatedStyle(() => {
          const x = interpolate(
            scrollX.value,
            [
              (index - 1) * (CARD_WIDTH + CARD_SPACING),
              index * (CARD_WIDTH + CARD_SPACING),
              (index + 1) * (CARD_WIDTH + CARD_SPACING),
            ],
            [-CARD_WIDTH, 0, CARD_WIDTH],
            'clamp'
          );

          // Calculate opacity based on distance from center
          const opacity = interpolate(
            scrollX.value,
            [
              (index - 0.8) * (CARD_WIDTH + CARD_SPACING), // Start fade slightly before
              index * (CARD_WIDTH + CARD_SPACING),
              (index + 0.8) * (CARD_WIDTH + CARD_SPACING), // End fade slightly after
            ],
            [0, 1, 0],
            'clamp'
          );

          const scale = interpolate(
            scrollX.value,
            [
              (index - 1) * (CARD_WIDTH + CARD_SPACING),
              index * (CARD_WIDTH + CARD_SPACING),
              (index + 1) * (CARD_WIDTH + CARD_SPACING),
            ],
            [0.8, 1, 0.8],
            'clamp'
          );

          return {
            transform: [{ translateX: x }, { scale }],
            opacity,
          };
        });

        return (
          <Animated.View
            key={card.id}
            style={[
              {
                position: 'absolute',
                width: CARD_WIDTH,
                left: WINDOW_WIDTH / 2 - CARD_WIDTH / 2,
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              },
              titleStyle,
            ]}
          >
            <Animated.Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                color: Colors.dark.text,
                textAlign: 'center',
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
              numberOfLines={1}
            >
              {card.title}
            </Animated.Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

const Carousel = memo(({ scrollX, showCarousel }) => {
  const flatListRef = useAnimatedRef();

  const renderCard = useCallback(
    ({ item, index }) => (
      <CarouselCard item={item} index={index} scrollX={scrollX} showCarousel={showCarousel} />
    ),
    [showCarousel]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    // Scroll to center card after mounting
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: 1, animated: false });
      }, 100);
    }
  }, []);

  return (
    <View>
      <AnimatedTitle scrollX={scrollX} />
      <Animated.FlatList
        ref={flatListRef}
        data={SAMPLE_CARDS}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (WINDOW_WIDTH - CARD_WIDTH) / 2,
        }}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + CARD_SPACING,
          offset: (CARD_WIDTH + CARD_SPACING) * index,
          index,
        })}
      />
    </View>
  );
});

const AddCardScreen = () => {
  const insets = useSafeAreaInsets();
  const [showCard, setShowCard] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const scale = useSharedValue(0.3);
  const borderRadius = useSharedValue(CIRCLE_SIZE / 2);
  const width = useSharedValue(CIRCLE_SIZE);
  const height = useSharedValue(CIRCLE_SIZE);
  const translateY = useSharedValue(WINDOW_HEIGHT - (insets.top + START_TOP + BOTTOM_NAV_HEIGHT));
  const squish = useSharedValue(1);
  const scrollX = useSharedValue(0);

  const onAnimationComplete = () => {
    setShowCard(true);
    // Show carousel (center card first) after morphing circle fades out
    setTimeout(() => {
      setShowCarousel(true);
    }, 400);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      borderRadius: borderRadius.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
        { scaleX: squish.value },
        { scaleY: 2 - squish.value },
      ],
      backgroundColor: Colors.dark.primary,
      opacity: showCard ? withTiming(0, { duration: 200 }) : 1, // Faster fade out
    };
  });

  useEffect(() => {
    // Rise and bounce from bottom with slower spring
    translateY.value = withSpring(0, {
      ...springConfig,
      damping: 14,
      velocity: -1.5,
    });

    // Scale bounce with slower spring
    scale.value = withSequence(
      withSpring(1.1, {
        ...springConfig,
        damping: 12,
      }),
      withSpring(1, {
        ...springConfig,
        damping: 14,
      })
    );

    // Start liquid morphing after the bounce
    const morphDelay = 600;

    // First squish horizontally - more extreme squish
    squish.value = withDelay(
      morphDelay,
      withSpring(2.2, {
        ...liquidSpring,
        stiffness: 40,
      })
    );

    // Expand width while maintaining squish
    width.value = withDelay(
      morphDelay + 100,
      withSpring(CARD_WIDTH, {
        ...liquidSpring,
        stiffness: 35,
      })
    );

    // Quick partial height expansion while still squished
    height.value = withDelay(
      morphDelay + 200,
      withSpring(CIRCLE_SIZE * 2, {
        ...liquidSpring,
        stiffness: 45,
      })
    );

    // Release squish more gradually
    squish.value = withDelay(
      morphDelay + 300,
      withSpring(1, {
        ...liquidSpring,
        stiffness: 30,
      })
    );

    // Final height expansion
    height.value = withDelay(
      morphDelay + 400,
      withSpring(
        CARD_HEIGHT,
        {
          ...liquidSpring,
          stiffness: 35,
        },
        () => {
          runOnJS(onAnimationComplete)();
        }
      )
    );

    // Smoother border radius transition
    borderRadius.value = withDelay(
      morphDelay + 100,
      withSpring(20, {
        ...liquidSpring,
        stiffness: 25,
      })
    );

    return () => {};
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View f={1} bg={Colors.dark.background}>
        <View width={WINDOW_WIDTH} height={WINDOW_HEIGHT} pt={insets.top + START_TOP} ai="center">
          <View width={WINDOW_WIDTH} height={CARD_HEIGHT} ai="center" jc="center">
            <Animated.View
              style={[
                {
                  position: 'absolute',
                },
                animatedStyle,
              ]}
            />
            <Carousel scrollX={scrollX} showCarousel={showCarousel} />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default AddCardScreen;
