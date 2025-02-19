import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Button, Text, Spinner, YStack, XStack } from 'tamagui';
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
import { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import CardConfigComponent from '@/components/card-creation/CardConfigComponent';
import CardReviewComponent from '@/components/card-creation/CardReviewComponent';
import { Paths } from '@/navigation/paths';
import CardComponent from '@/components/CardComponent';
import { useUser } from '@/hooks/useUser';
import { BanknotesIcon } from 'react-native-heroicons/outline';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import Toast from 'react-native-toast-message';
import { usePlans } from '@/hooks/usePlans';
import { SparklesIcon } from 'react-native-heroicons/outline';
import { XMarkIcon } from 'react-native-heroicons/solid';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const WINDOW_HEIGHT = window.height;
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);
const CIRCLE_SIZE = 60;
const START_TOP = 120;
const BOTTOM_NAV_HEIGHT = 80;
const CARD_SPACING = 20;

const SAMPLE_CARDS = [
  {
    id: '1',
    type: 'MERCHANT_LOCKED',
    label: 'Amazon',
    emoji: '📦',
    backgroundColor: Colors.cards.green,
    title: 'Merchant-Locked Card',
    description: 'Use your card with only one merchant. Your Amazon card!',
    isPaused: false,
    isClosed: false,
  },
  {
    id: '4',
    type: 'BURNER',
    label: 'Notion Free Trial',
    emoji: '🔥',
    backgroundColor: Colors.cards.red,
    title: 'Burner Card',
    description: 'A card that expires after one use. Free trials make great burners!',
    isPaused: false,
    isClosed: false,
  },
  {
    id: '2',
    type: 'CATEGORY_LOCKED',
    label: 'Groceries',
    emoji: '🫐',
    backgroundColor: Colors.cards.pink,
    title: 'Category-Locked Card',
    description: 'Use your card for one category of expenses. Only shop for groceries with this card',
    isPaused: false,
    isClosed: false,
  },
  {
    id: '3',
    type: 'LOCATION_LOCKED',
    label: 'London',
    emoji: '🇬🇧',
    backgroundColor: Colors.cards.navy,
    title: 'Location-Locked Card',
    description: 'Set location boundaries for card usage. Budget for your trip to London!',
    isPaused: false,
    isClosed: false,
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
        <CardComponent cardId={item.id} displayData={item} isPreview={true} />
      </Animated.View>
    </View>
  );
});

const Carousel = ({
  scrollX,
  showCarousel,
  selectedCard,
  setSelectedCard,
  onSelect,
  initialIndex,
  colors,
  orderedCards,
  isPremium,
}) => {
  const flatListRef = useAnimatedRef();

  const renderCard = useCallback(
    ({ item, index }) => <CarouselCard item={item} index={index} scrollX={scrollX} showCarousel={showCarousel} />,
    [showCarousel]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      // Update selected card based on scroll position
      const selectedIndex = Math.round(event.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
      runOnJS(setSelectedCard)(orderedCards[selectedIndex]);
    },
  });

  // Set initial scroll value directly
  useEffect(() => {
    if (initialIndex !== undefined) {
      scrollX.value = initialIndex * (CARD_WIDTH + CARD_SPACING);
    }
  }, [initialIndex]);

  return (
    <View>
      <AnimatedTitle scrollX={scrollX} showCarousel={showCarousel} colors={colors} cards={orderedCards} />
      <Animated.FlatList
        ref={flatListRef}
        data={orderedCards}
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
        initialScrollIndex={initialIndex}
        initialNumToRender={orderedCards.length}
      />
      <AnimatedDescription
        scrollX={scrollX}
        showCarousel={showCarousel}
        colors={colors}
        cards={orderedCards}
        isPremium={isPremium}
      />
    </View>
  );
};

const AnimatedTitle = memo(({ scrollX, showCarousel, colors, cards }) => {
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
      {cards.map((card, index) => {
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
                fontFamily: 'Archivo_700Bold',
                color: colors.text,
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

const AnimatedDescription = memo(({ scrollX, showCarousel, colors, cards, isPremium }) => {
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
      {cards.map((card, index) => {
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

        const isPremiumOnly = ['CATEGORY_LOCKED', 'LOCATION_LOCKED'].includes(card.type);

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
            <YStack gap="$2" ai="center">
              {isPremiumOnly && !isPremium && (
                <XStack
                  backgroundColor={`${colors.primary}15`}
                  px="$2"
                  py="$1"
                  br={20}
                  borderWidth={1}
                  borderColor={`${colors.primary}30`}
                  ai="center"
                  gap="$1"
                  mb="$1"
                >
                  <SparklesIcon size={10} color={colors.primary} />
                  <Text color={colors.primary} fontSize={11} fontWeight="500">
                    Premium only
                  </Text>
                </XStack>
              )}
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  fontFamily: '$archivo',
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                {card.description}
              </Text>
            </YStack>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
});

const SelectButton = memo(({ showCarousel, selectedCard, onSelect, onUpgrade, colors, isPremium }) => {
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

  const isPremiumOnly = ['CATEGORY_LOCKED', 'LOCATION_LOCKED'].includes(selectedCard?.type);
  const showUpgradeButton = !isPremium && isPremiumOnly;

  return (
    <Animated.View style={[buttonStyle, { width: '100%', paddingHorizontal: 28 }]}>
      <Button
        f={1}
        backgroundColor={showUpgradeButton ? colors.primary : colors.backgroundSecondary}
        color={showUpgradeButton ? 'white' : colors.text}
        size="$5"
        fontWeight="600"
        borderRadius={12}
        pressStyle={{ backgroundColor: showUpgradeButton ? colors.primaryDark : colors.backgroundTertiary }}
        onPress={() => (showUpgradeButton ? onUpgrade() : onSelect(selectedCard))}
        borderWidth={1}
        borderColor={showUpgradeButton ? colors.primaryDark : colors.border}
      >
        {showUpgradeButton ? (
          <XStack ai="center" gap="$2">
            <SparklesIcon size={20} color="white" />
            <Text color="white" fontSize="$4" fontWeight="600">
              Upgrade to Premium
            </Text>
          </XStack>
        ) : (
          'Create Card'
        )}
      </Button>
    </Animated.View>
  );
});

const AddCardScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const initialCardType = route.params?.initialCardType;
  const { issuanceLimit } = useUser();
  const { authenticate, isAuthenticating } = useBiometricAuth();
  const { currentPlan } = usePlans();
  const isPremium = currentPlan === 'PREMIUM';

  // Check if user has reached their limit
  const hasReachedLimit = issuanceLimit && issuanceLimit.currentMonthUsage >= issuanceLimit.monthlyLimit;

  // Reorder sample cards to put the selected type in the center
  const orderedCards = useMemo(() => {
    if (!initialCardType) return SAMPLE_CARDS;

    const cards = [...SAMPLE_CARDS];
    const targetIndex = cards.findIndex((card) => card.type === initialCardType);

    if (targetIndex === -1) return cards;

    // Remove the target card
    const [targetCard] = cards.splice(targetIndex, 1);

    // If we have enough cards, ensure we maintain a card before the target
    if (cards.length > 0) {
      // Insert the target card at index 1
      cards.splice(1, 0, targetCard);
    } else {
      // If we don't have enough cards, just add it back
      cards.push(targetCard);
    }

    return cards;
  }, [initialCardType]);

  // Get the initial card's color
  const initialCardColor = useMemo(() => {
    const centerCard = orderedCards[1]; // Always use center card
    return centerCard?.backgroundColor || Colors.dark.primary;
  }, [orderedCards]);

  const [showCard, setShowCard] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedCard, setSelectedCard] = useState(orderedCards[1]); // Always use center card
  const [selectedIndex, setSelectedIndex] = useState(1); // Always start at center
  const [step, setStep] = useState('select');
  const [cardData, setCardData] = useState(null);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const scale = useSharedValue(0.3);
  const borderRadius = useSharedValue(CIRCLE_SIZE / 2);
  const width = useSharedValue(CIRCLE_SIZE);
  const height = useSharedValue(CIRCLE_SIZE);
  const translateY = useSharedValue(WINDOW_HEIGHT - (insets.top + START_TOP + BOTTOM_NAV_HEIGHT));
  const squish = useSharedValue(1);
  const scrollX = useSharedValue(0);

  const resetAnimationValues = () => {
    scale.value = 0.3;
    borderRadius.value = CIRCLE_SIZE / 2;
    width.value = CIRCLE_SIZE;
    height.value = CIRCLE_SIZE;
    translateY.value = WINDOW_HEIGHT - (insets.top + START_TOP + BOTTOM_NAV_HEIGHT);
    squish.value = 1;
    setShowCard(false);
    setShowCarousel(false);
  };

  const startAnimation = () => {
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
  };

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
      backgroundColor: initialCardColor,
      opacity: showCard ? withTiming(0, { duration: 100 }) : 1,
    };
  });

  useEffect(() => {
    startAnimation();
    return () => {
      resetAnimationValues();
    };
  }, []);

  // Watch for step changes to reset animation when returning to select
  useEffect(() => {
    if (step === 'select' && !isInitialMount) {
      setShowCard(true);
      setShowCarousel(true);
      // Find the index of the currently selected card
      const index = SAMPLE_CARDS.findIndex((card) => card.id === selectedCard.id);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [step]);

  const handleSelectCard = (card) => {
    const isPremiumOnly = ['CATEGORY_LOCKED', 'LOCATION_LOCKED'].includes(card.type);
    if (isPremiumOnly && !isPremium) {
      navigation.navigate(Paths.SUBSCRIPTION_MANAGEMENT);
      return;
    }

    setIsInitialMount(false);
    const index = SAMPLE_CARDS.findIndex((c) => c.id === card.id);
    if (index !== -1) {
      setSelectedIndex(index);
    }
    setStep('config');
  };

  const handleUpgrade = () => {
    navigation.navigate(Paths.SUBSCRIPTION_MANAGEMENT);
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

  const handleCreateCard = async (finalCardData) => {
    try {
      const authenticated = await authenticate();

      if (authenticated) {
        proceedWithCardCreation(finalCardData);
      }
    } catch (error) {
      console.log('Error during card creation:', error);
      Toast.show({
        type: 'error',
        text1: 'Card Creation Failed',
        text2: 'An error occurred while creating your card',
      });
    }
  };

  const proceedWithCardCreation = (finalCardData) => {
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

  const renderStep = (cards) => {
    switch (step) {
      case 'select':
        return (
          <>
            {isInitialMount && (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                  },
                  animatedStyle,
                ]}
              />
            )}
            <View f={1} pb={BOTTOM_NAV_HEIGHT + insets.bottom + 20}>
              <Carousel
                scrollX={scrollX}
                showCarousel={showCarousel}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                onSelect={handleSelectCard}
                initialIndex={selectedIndex}
                colors={colors}
                orderedCards={cards}
                isPremium={isPremium}
              />
            </View>
          </>
        );
      case 'config':
        return (
          <View f={1} pt={16}>
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
          <View f={1} pt={16}>
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

  // If user has reached their limit, show the limit reached message
  if (hasReachedLimit) {
    return (
      <View f={1} bg={colors.background} pt={insets.top}>
        <View width={WINDOW_WIDTH} height={WINDOW_HEIGHT} ai="center" jc="center" px="$4">
          <YStack ai="center" gap="$4">
            <View width={80} height={80} br={40} bg={`${colors.primary}20`} ai="center" jc="center" mb="$2">
              <BanknotesIcon size={40} color={colors.primary} />
            </View>
            <Text color={colors.text} fontSize="$7" fontFamily="$archivoBlack" textAlign="center">
              Monthly Limit Reached
            </Text>
            <Text color={colors.textSecondary} fontSize="$4" textAlign="center" mb="$4">
              You've created {issuanceLimit.currentMonthUsage} out of {issuanceLimit.monthlyLimit} cards this month.
              Please try again next month or upgrade your plan for a higher limit.
            </Text>
            <Button
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => navigation.goBack()}
              width={CARD_WIDTH}
              size="$5"
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.border}
            >
              <Text color={colors.text} fontSize="$4" fontWeight="600">
                Go Back
              </Text>
            </Button>
          </YStack>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View f={1} bg={colors.background} pt={insets.top}>
        <View backgroundColor={colors.background}>
          <XStack ai="center" jc="space-between" px="$4" pt="$2">
            <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack" fontWeight="900">
              Create a Card
            </Text>
            <Button
              size="$3"
              circular
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => navigation.goBack()}
              borderWidth={1}
              borderColor={colors.border}
            >
              <XMarkIcon size={20} color={colors.text} />
            </Button>
          </XStack>
        </View>

        <View width={WINDOW_WIDTH} height={WINDOW_HEIGHT} ai="center">
          {/* Card Section */}
          <View
            width={WINDOW_WIDTH}
            ai="center"
            mt={step === 'select' ? START_TOP : 0}
            f={1}
            style={{
              paddingBottom: step === 'select' ? 0 : insets.bottom,
            }}
          >
            {renderStep(orderedCards)}
          </View>

          {/* Button Section */}
          {step === 'select' && (
            <View position="absolute" bottom={BOTTOM_NAV_HEIGHT + insets.bottom + 30} width={WINDOW_WIDTH} ai="center">
              <SelectButton
                showCarousel={showCarousel}
                selectedCard={selectedCard}
                onSelect={handleSelectCard}
                onUpgrade={handleUpgrade}
                colors={colors}
                isPremium={isPremium}
              />
            </View>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default AddCardScreen;
