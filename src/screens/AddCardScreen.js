import { Colors } from '@/config/colors';
import { View, Button, Text } from 'tamagui';
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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import CardConfigComponent from '@/components/card-creation/CardConfigComponent';
import CardReviewComponent from '@/components/card-creation/CardReviewComponent';
import { Paths } from '@/navigation/paths';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const WINDOW_HEIGHT = window.height;
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);
const CIRCLE_SIZE = 60;
const START_TOP = 140;
const BOTTOM_NAV_HEIGHT = 80;
const CARD_SPACING = 20;

const SAMPLE_CARDS = [
  {
    id: '1',
    type: 'Merchant',
    label: 'Amazon',
    emoji: '🛍️',
    color: Colors.cards.green,
    title: 'Merchant-Locked',
    description: 'Use your card with only one merchant. Your Amazon card!',
  },
  {
    id: '2',
    type: 'Category',
    label: 'Groceries',
    emoji: '📅',
    color: Colors.cards.pink,
    title: 'Category-Locked',
    description:
      'Use your card for one category of expenses. Only shop for groceries with this card',
  },
  {
    id: '3',
    type: 'Location',
    label: 'London',
    emoji: '✈️',
    color: Colors.cards.blue,
    title: 'Location-Locked',
    description: 'Set location boundaries for card usage. Budget for your trip to London!',
  },
  {
    id: '4',
    type: 'Burner',
    label: 'Notion Free Trial',
    emoji: '🔥',
    color: Colors.cards.yellow,
    title: 'Single-Use',
    description: 'A card that expires after one use. Free trials make great burners!',
  },
];

const springConfig = {
  damping: 15,
  stiffness: 70,
  mass: 1,
};

const liquidSpring = {
  damping: 10,
  stiffness: 15,
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
    const translateX = showCarousel ? withSpring(0, { damping: 10, stiffness: 20 }) : slideOut;

    // Center card appears instantly, side cards animate in
    let opacity;
    if (index === centerIndex) {
      opacity = showCarousel ? 1 : 0;
    } else {
      opacity = showCarousel ? withDelay(200, withSpring(1, { damping: 12, stiffness: 35 })) : 0;
    }

    return {
      transform: [{ scale }, { translateY }, { translateX }],
      opacity,
    };
  });

  return (
    <View
      style={{
        width: CARD_WIDTH,
        marginRight: index < SAMPLE_CARDS.length - 1 ? CARD_SPACING : 0,
        alignItems: 'center',
      }}
    >
      <Animated.View style={cardStyle}>
        <AddCardComponent
          type={item.type}
          label={item.label}
          emoji={item.emoji}
          color={item.color}
        />
      </Animated.View>
    </View>
  );
});

const AnimatedTitle = memo(({ scrollX, showCarousel }) => {
  const titleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: showCarousel ? withDelay(200, withSpring(1, { damping: 12, stiffness: 35 })) : 0,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -80,
          left: 0,
          right: 0,
          height: 40,
          justifyContent: 'center',
        },
        titleContainerStyle,
      ]}
    >
      {SAMPLE_CARDS.map((card, index) => {
        const containerStyle = useAnimatedStyle(() => {
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

          const opacity = interpolate(
            scrollX.value,
            [
              (index - 0.8) * (CARD_WIDTH + CARD_SPACING),
              index * (CARD_WIDTH + CARD_SPACING),
              (index + 0.8) * (CARD_WIDTH + CARD_SPACING),
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
              containerStyle,
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
    </Animated.View>
  );
});

const AnimatedDescription = memo(({ scrollX, showCarousel }) => {
  const descriptionContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: showCarousel ? withDelay(200, withSpring(1, { damping: 12, stiffness: 35 })) : 0,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: CARD_HEIGHT + 40,
          left: 0,
          right: 0,
          minHeight: 60,
          justifyContent: 'center',
        },
        descriptionContainerStyle,
      ]}
    >
      {SAMPLE_CARDS.map((card, index) => {
        const containerStyle = useAnimatedStyle(() => {
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

          const opacity = interpolate(
            scrollX.value,
            [
              (index - 0.8) * (CARD_WIDTH + CARD_SPACING),
              index * (CARD_WIDTH + CARD_SPACING),
              (index + 0.8) * (CARD_WIDTH + CARD_SPACING),
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
                paddingHorizontal: 16,
              },
              containerStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                color: Colors.dark.textSecondary,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              {card.description}
            </Text>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
});

const SelectButton = memo(({ showCarousel, selectedCard, onSelect }) => {
  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: showCarousel ? withDelay(400, withSpring(1, { damping: 15 })) : 0,
      transform: [
        {
          translateY: showCarousel ? withDelay(400, withSpring(0, { damping: 15 })) : 20,
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ width: CARD_WIDTH }, buttonStyle]}>
      <Button
        backgroundColor={Colors.dark.backgroundSecondary}
        color={Colors.dark.text}
        size="$5"
        fontWeight="600"
        borderRadius={12}
        pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
        onPress={() => onSelect(selectedCard)}
      >
        Select Card
      </Button>
    </Animated.View>
  );
});

const Carousel = memo(({ scrollX, showCarousel, selectedCard, setSelectedCard, onSelect }) => {
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
      // Update selected card based on scroll position
      const selectedIndex = Math.round(event.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
      runOnJS(setSelectedCard)(SAMPLE_CARDS[selectedIndex]);
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
      <AnimatedTitle scrollX={scrollX} showCarousel={showCarousel} />
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
      <AnimatedDescription scrollX={scrollX} showCarousel={showCarousel} />
    </View>
  );
});

const AddCardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [showCard, setShowCard] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedCard, setSelectedCard] = useState(SAMPLE_CARDS[1]); // Default to center card
  const [step, setStep] = useState('select'); // 'select', 'config', 'review'
  const [cardData, setCardData] = useState(null);

  const scale = useSharedValue(0.3);
  const borderRadius = useSharedValue(CIRCLE_SIZE / 2);
  const width = useSharedValue(CIRCLE_SIZE);
  const height = useSharedValue(CIRCLE_SIZE);
  const translateY = useSharedValue(WINDOW_HEIGHT - (insets.top + START_TOP + BOTTOM_NAV_HEIGHT));
  const squish = useSharedValue(1);
  const scrollX = useSharedValue(0);

  const onAnimationComplete = () => {
    // Trigger both state changes after a very brief delay to ensure morphing is complete
    requestAnimationFrame(() => {
      setShowCard(true);
      setShowCarousel(true);
    });
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
      opacity: showCard ? withTiming(0, { duration: 100 }) : 1, // Faster fade out (reduced from 200ms to 100ms)
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
          stiffness: 60,
          velocity: 2,
          overshootClamping: true,
          restSpeedThreshold: 0.01,
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

  const handleSelectCard = (card) => {
    setStep('config');
  };

  const handleConfigBack = () => {
    setStep('select');
  };

  const handleConfigNext = (data) => {
    setCardData(data);
    setStep('review');
  };

  const handleReviewBack = () => {
    setStep('config');
  };

  const handleCreateCard = (finalCardData) => {
    // Reset navigation state and navigate to Home tab
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              routes: [{ name: Paths.HOME }],
              index: 0,
            },
          },
        ],
      })
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                },
                animatedStyle,
              ]}
            />
            <View f={1} pb={BOTTOM_NAV_HEIGHT + insets.bottom + 20}>
              <Carousel
                scrollX={scrollX}
                showCarousel={showCarousel}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                onSelect={handleSelectCard}
              />
            </View>
          </>
        );
      case 'config':
        return (
          <View f={1} pb={insets.bottom}>
            <CardConfigComponent
              cardType={selectedCard.type}
              initialData={selectedCard}
              onBack={handleConfigBack}
              onNext={handleConfigNext}
            />
          </View>
        );
      case 'review':
        return (
          <View f={1} pb={insets.bottom}>
            <CardReviewComponent
              cardType={selectedCard.type}
              cardData={cardData}
              onBack={handleReviewBack}
              onCreateCard={handleCreateCard}
            />
          </View>
        );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View f={1} bg={Colors.dark.background}>
        <View width={WINDOW_WIDTH} height={WINDOW_HEIGHT} ai="center">
          {/* Card Section */}
          <View
            width={WINDOW_WIDTH}
            ai="center"
            mt={START_TOP}
            f={1}
            style={{
              paddingBottom: step === 'select' ? 0 : insets.bottom,
            }}
          >
            {renderStep()}
          </View>

          {/* Button Section */}
          {step === 'select' && (
            <View
              position="absolute"
              bottom={BOTTOM_NAV_HEIGHT + insets.bottom + 20}
              width={WINDOW_WIDTH}
              ai="center"
            >
              <SelectButton
                showCarousel={showCarousel}
                selectedCard={selectedCard}
                onSelect={handleSelectCard}
              />
            </View>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default AddCardScreen;
