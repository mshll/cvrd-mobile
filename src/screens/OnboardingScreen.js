import { View, Text, Button } from 'tamagui';
import { Colors, useColors, useAppTheme } from '@/context/ColorSchemeContext';
import { StyleSheet, Animated, Dimensions, Image, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const CARD_SLIDES = [
  {
    id: 1,
    pattern: require('@/../assets/cards/location-front-light.png'),
    color: Colors.cards.pink,
  },
  {
    id: 2,
    pattern: require('@/../assets/cards/burner-front-light.png'),
    color: Colors.cards.yellow,
  },
  {
    id: 3,
    pattern: require('@/../assets/cards/category-front-light.png'),
    color: Colors.cards.blue,
  },
  {
    id: 4,
    pattern: require('@/../assets/cards/merchant-front-light.png'),
    color: Colors.cards.green,
  },
];

const ONBOARDING_SCREENS = [
  { id: 1, type: 'animation' },
  {
    id: 2,
    title: 'ONE AND\nDONE',
    description: 'Secure your one-time purchases\nwith disposable cards',
    pattern: require('@/../assets/patterns/pattern1.png'),
    color: Colors.cards.yellow,
  },
  {
    id: 3,
    title: 'STAY ON\nTRACK',
    description: 'Spend only on what you choose',
    pattern: require('@/../assets/patterns/pattern2.png'),
    color: Colors.cards.blue,
  },
  {
    id: 4,
    title: 'KEEP YOUR\nCONTROL',
    description: 'See all your subscriptions in one\nplace and cancel with ease',
    pattern: require('@/../assets/patterns/pattern3.png'),
    color: Colors.cards.green,
  },
  {
    id: 5,
    title: 'SPEND\nWHERE IT\nCOUNTS',
    description: 'Your card works only where you\nneed it',
    pattern: require('@/../assets/patterns/pattern4.png'),
    color: Colors.cards.pink,
  },
];

const SLIDE_DURATION = 500;
const TRANSITION_DURATION = 500;

const AnimatedScreen = ({ fadeAnim, logoColorAnim, currentIndex }) => {
  const colors = useColors();

  return (
    <View style={styles.screen}>
      {/* Background Pattern */}
      <Animated.View
        style={[
          styles.backgroundContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Image source={CARD_SLIDES[currentIndex].pattern} style={styles.backgroundPattern} tintColor={colors.text} />
      </Animated.View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* Base logo part 1 (static white) */}
        <Image
          source={require('@/../assets/logo-p1.png')}
          style={[styles.logo]}
          resizeMode="contain"
          tintColor={colors.text}
        />
        {/* Logo part 2 (animated color) */}
        <Animated.Image
          source={require('@/../assets/logo-p2.png')}
          style={[
            styles.logo,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              tintColor: logoColorAnim.interpolate({
                inputRange: [0, 1, 2, 3, 4],
                outputRange: [
                  Colors.cards.pink,
                  Colors.cards.yellow,
                  Colors.cards.blue,
                  Colors.cards.green,
                  Colors.cards.pink,
                ],
              }),
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const ContentScreen = ({ title, description, pattern, color }) => {
  const circlePosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circleVelocity = useRef({ x: 2, y: 2 }).current;
  const animationFrame = useRef(null);
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  const colors = useColors();
  const { effectiveColorScheme } = useAppTheme();
  useEffect(() => {
    // Fade in the circle
    Animated.timing(circleOpacity, {
      toValue: 0.2,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Continuous animation
    const CIRCLE_SIZE = 300; // Increased size for more visible blur
    const BOUNDS = {
      xMin: -width / 2 + CIRCLE_SIZE / 2,
      xMax: width / 2 - CIRCLE_SIZE / 2,
      yMin: -height / 2 + CIRCLE_SIZE / 2,
      yMax: height / 2 - CIRCLE_SIZE / 2,
    };

    const animate = () => {
      // Update position based on velocity
      const newX = circlePosition.x._value + circleVelocity.x;
      const newY = circlePosition.y._value + circleVelocity.y;

      // Check bounds and reverse velocity if needed
      if (newX <= BOUNDS.xMin || newX >= BOUNDS.xMax) {
        circleVelocity.x *= -1;
      }
      if (newY <= BOUNDS.yMin || newY >= BOUNDS.yMax) {
        circleVelocity.y *= -1;
      }

      // Apply new position
      circlePosition.setValue({
        x: newX,
        y: newY,
      });

      // Subtle scale animation
      const time = Date.now() / 1000;
      const scale = 1 + Math.sin(time) * 0.1; // Subtle pulsing between 0.9 and 1.1
      circleScale.setValue(scale);

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <View style={styles.screen}>
      {/* Background Pattern */}
      <View style={styles.patternContainer}>
        <Image
          source={pattern}
          style={[
            styles.pattern,
            {
              opacity: 0.6,
            },
          ]}
          resizeMode="contain"
        />

        {/* Animated Blurred Circle */}
        <Animated.View
          style={[
            styles.animatedCircleContainer,
            {
              transform: [{ translateX: circlePosition.x }, { translateY: circlePosition.y }, { scale: circleScale }],
              opacity: circleOpacity,
            },
          ]}
        >
          <BlurView intensity={100} tint={effectiveColorScheme} style={styles.blurView}>
            <View style={[styles.animatedCircle, { backgroundColor: color }]} />
          </BlurView>
          {/* Additional blur layers for hazier edges */}
          <BlurView intensity={60} tint={effectiveColorScheme} style={[styles.blurView, styles.outerBlur]} />
          <BlurView intensity={40} tint={effectiveColorScheme} style={[styles.blurView, styles.outerMostBlur]} />
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text color={color} fontSize={64} fontFamily="Archivo_900Black_Italic" textAlign="center" lineHeight={58}>
          {title}
        </Text>
        <Text
          color={colors.textSecondary}
          fontSize="$4"
          textAlign="center"
          mt="$4"
          lineHeight={24}
          fontFamily="$archivo"
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

const OnboardingScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoColorAnim = useRef(new Animated.Value(0)).current;
  const slideTimer = useRef(null);
  const flatListRef = useRef(null);

  // Animation values for morphing
  const containerWidth = useRef(new Animated.Value(160)).current; // Initial width for indicators
  const containerHeight = useRef(new Animated.Value(40)).current; // Initial height for indicators
  const containerBorderRadius = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const indicatorsOpacity = useRef(new Animated.Value(1)).current;
  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    if (currentScreen === ONBOARDING_SCREENS.length - 1) {
      // Morph to button
      Animated.parallel([
        Animated.timing(containerWidth, {
          toValue: windowWidth * 0.8,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(containerHeight, {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(containerBorderRadius, {
          toValue: 12,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(indicatorsOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Morph back to indicators
      Animated.parallel([
        Animated.timing(containerWidth, {
          toValue: 160,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(containerHeight, {
          toValue: 40,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(containerBorderRadius, {
          toValue: 20,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(indicatorsOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [currentScreen]);

  // Handle auto-play for first screen only
  useEffect(() => {
    if (currentScreen === 0) {
      const startSlideTimer = () => {
        slideTimer.current = setTimeout(() => {
          if (currentCardIndex < CARD_SLIDES.length - 1) {
            animateToNextSlide(currentCardIndex + 1);
          } else {
            animateToNextSlide(0);
          }
        }, SLIDE_DURATION);
      };

      startSlideTimer();

      return () => {
        if (slideTimer.current) {
          clearTimeout(slideTimer.current);
        }
      };
    }
  }, [currentCardIndex, currentScreen]);

  const animateToNextSlide = (nextIndex) => {
    // Smooth fade transition
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: TRANSITION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setCurrentCardIndex(nextIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TRANSITION_DURATION,
        useNativeDriver: true,
      }).start();
    });

    // Animate logo color with circular transition
    const nextValue = nextIndex === 0 ? 4 : nextIndex;
    Animated.timing(logoColorAnim, {
      toValue: nextValue,
      duration: TRANSITION_DURATION * 2,
      useNativeDriver: false,
    }).start(() => {
      if (nextIndex === 0) {
        logoColorAnim.setValue(0);
      }
    });
  };

  const handleSkip = () => {
    if (slideTimer.current) {
      clearTimeout(slideTimer.current);
    }
    navigation.replace(Paths.LOGIN);
  };

  const handleScroll = (event) => {
    const screenIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentScreen(screenIndex);
  };

  const renderScreen = ({ item }) => {
    if (item.type === 'animation') {
      return <AnimatedScreen fadeAnim={fadeAnim} logoColorAnim={logoColorAnim} currentIndex={currentCardIndex} />;
    }
    return (
      <ContentScreen title={item.title} description={item.description} pattern={item.pattern} color={item.color} />
    );
  };

  return (
    <View style={styles.container} backgroundColor={colors.background}>
      {/* Skip Button */}
      <Button
        position="absolute"
        top={insets.top + 16}
        right={16}
        size="$3"
        backgroundColor={colors.backgroundSecondary}
        pressStyle={{ backgroundColor: colors.backgroundTertiary }}
        onPress={handleSkip}
        opacity={0.8}
        br={8}
        zIndex={1}
        borderColor={colors.border}
        borderWidth={1}
      >
        <Text color={colors.text} fontSize="$3">
          Skip
        </Text>
      </Button>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SCREENS}
        renderItem={renderScreen}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id.toString()}
        bounces={false}
      />

      {/* Morphing Container */}
      <Animated.View
        style={[
          styles.morphContainer,
          {
            bottom: insets.bottom + 40,
            width: currentScreen === ONBOARDING_SCREENS.length - 1 ? windowWidth * 0.8 : containerWidth,
            height: containerHeight,
            borderRadius: containerBorderRadius,
            backgroundColor:
              currentScreen === ONBOARDING_SCREENS.length - 1 ? colors.primary : colors.backgroundSecondary,
            borderWidth: currentScreen === ONBOARDING_SCREENS.length - 1 ? 0 : 1,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Progress Indicators */}
        <Animated.View style={[styles.indicatorsWrapper, { opacity: indicatorsOpacity }]}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentScreen ? colors.primary : colors.backgroundTertiary,
                  width: index === currentScreen ? 24 : 8,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Button Text */}
        <Animated.View style={[styles.buttonTextWrapper, { opacity: textOpacity }]}>
          <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
            Get Started
          </Text>
        </Animated.View>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (currentScreen < ONBOARDING_SCREENS.length - 1) return; // Don't skip if not on last screen
            handleSkip();
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backgroundPattern: {
    width,
    height,
    opacity: 1,
  },
  logoContainer: {
    width: width * 0.4,
    height: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  patternContainer: {
    position: 'absolute',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pattern: {
    width: width,
    height: height,
    transform: [{ scale: 1.3 }],
  },
  morphContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    overflow: 'hidden',
    width: width,
  },
  indicatorsWrapper: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
  },
  buttonTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    transition: '0.3s',
  },
  animatedCircleContainer: {
    position: 'absolute',
    width: 300, // Increased size
    height: 300, // Increased size
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerBlur: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 180,
  },
  outerMostBlur: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    borderRadius: 210,
  },
  animatedCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
  },
});

export default OnboardingScreen;
