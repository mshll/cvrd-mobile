import { View, Text, Button } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet, Animated, Dimensions, Image, FlatList } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

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
  { id: 2, title: 'Create Virtual Cards', description: 'Generate virtual cards for different purposes' },
  { id: 3, title: 'Set Spending Limits', description: 'Control your spending with customizable limits' },
  { id: 4, title: 'Location Locking', description: 'Lock your cards to specific locations' },
  { id: 5, title: 'Get Started', description: 'Create your account to begin' },
];

const SLIDE_DURATION = 500;
const TRANSITION_DURATION = 500;

const AnimatedScreen = ({ fadeAnim, logoColorAnim, currentIndex }) => {
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
        <Image source={CARD_SLIDES[currentIndex].pattern} style={styles.backgroundPattern} />
      </Animated.View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* Base logo part 1 (static white) */}
        <Image source={require('@/../assets/logo-p1.png')} style={[styles.logo]} resizeMode="contain" />
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

const ContentScreen = ({ title, description }) => {
  const colors = useColors();
  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text color={colors.text} fontSize="$8" fontFamily="$archivoBlack" textAlign="center">
          {title}
        </Text>
        <Text color={colors.textSecondary} fontSize="$4" textAlign="center" mt="$4">
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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoColorAnim = useRef(new Animated.Value(0)).current;
  const slideTimer = useRef(null);
  const flatListRef = useRef(null);

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
    return <ContentScreen title={item.title} description={item.description} />;
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
      />

      {/* Progress Indicators */}
      <View style={[styles.progressContainer, { bottom: insets.bottom + 40 }]}>
        {ONBOARDING_SCREENS.map((_, index) => (
          <View
            key={index}
            width={8}
            height={8}
            br={4}
            backgroundColor={index === currentScreen ? colors.primary : colors.backgroundSecondary}
          />
        ))}
      </View>
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
  },
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
});

export default OnboardingScreen;
