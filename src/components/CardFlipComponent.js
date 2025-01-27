import { StyleSheet, Text, View, Animated, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import CardComponent from '@/components/CardComponent';
import { Colors } from '@/config/colors';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { useCards } from '@/hooks/useCards';
import { useRef, useState, useEffect } from 'react';
import { ClipboardDocumentIcon } from 'react-native-heroicons/solid';
import { XStack } from 'tamagui';
import Toast from 'react-native-toast-message';
import { CARD_WIDTH, CARD_HEIGHT, getCardTheme, getCardAssets, formatCardNumber, formatExpiryDate } from '@/utils/cardUtils';

const FLIP_DURATION = 500;
const AUTO_FLIP_DELAY = 5000;

const CardFlipComponent = ({ cardId }) => {
  const { getCardById } = useCards();
  const card = getCardById(cardId);
  const cardColor = Colors.cards[card.card_color] || card.card_color;
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const logoMoveAnim = useRef(new Animated.Value(0)).current;
  const detailsFadeAnim = useRef(new Animated.Value(0)).current;
  const autoFlipTimeout = useRef(null);

  const cardTheme = getCardTheme(cardColor);
  const textColor = cardTheme === 'light' ? 'white' : 'black';
  const { cardImg, logoImg } = getCardAssets(card.card_type, cardTheme);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (autoFlipTimeout.current) {
        clearTimeout(autoFlipTimeout.current);
      }
    };
  }, []);

  // Set up auto-flip when card is flipped to back
  useEffect(() => {
    if (isFlipped) {
      autoFlipTimeout.current = setTimeout(() => {
        flipCard();
      }, AUTO_FLIP_DELAY);
    }
    return () => {
      if (autoFlipTimeout.current) {
        clearTimeout(autoFlipTimeout.current);
      }
    };
  }, [isFlipped]);

  const handleCopyCardNumber = async () => {
    await Clipboard.setStringAsync(card.card_number);
    Toast.show({
      type: 'success',
      text1: 'Card number copied to clipboard',
      position: 'bottom',
    });
  };

  const flipCard = () => {
    // Clear any existing timeout when manually flipping
    if (autoFlipTimeout.current) {
      clearTimeout(autoFlipTimeout.current);
    }

    const toValue = isFlipped ? 0 : 180;

    // Start flip animation
    Animated.timing(flipAnim, {
      toValue,
      duration: FLIP_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);

      if (!isFlipped) {
        // Start secondary animations immediately after flip starts
        Animated.sequence([
          Animated.timing(logoMoveAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(detailsFadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Reset animations when flipping to front
        logoMoveAnim.setValue(0);
        detailsFadeAnim.setValue(0);
      }
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
  };

  const logoTranslateY = logoMoveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const renderFront = () => {
    return <CardComponent cardId={cardId} />;
  };

  const renderBack = () => {
    const cardNumberSegments = formatCardNumber(card.card_number);

    return (
      <View style={[styles.backContainer, { backgroundColor: cardColor }]}>
        <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.contentContainer}>
          {/* Animated Logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoTranslateY }] }]}>
            <Image source={logoImg} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          {/* Animated Card Details */}
          <Animated.View style={[styles.cardDetailsWrapper, { opacity: detailsFadeAnim }]}>
            <View style={styles.cardNumberContainer}>
              <XStack ai="flex-end" gap="$2">
                <TouchableOpacity onPress={handleCopyCardNumber} style={styles.copyButton}>
                  <ClipboardDocumentIcon size={22} color={textColor} />
                </TouchableOpacity>
                <View>
                  {cardNumberSegments.map((segment, index) => (
                    <Text key={index} style={[styles.cardNumber, { color: textColor }]}>
                      {segment}
                    </Text>
                  ))}
                </View>
              </XStack>
            </View>
            <View style={styles.cardDetailsContainer}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: textColor }]}>Expiry Date</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{formatExpiryDate(card.expiry_date)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: textColor }]}>CVV</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{card.cvv}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View style={styles.container}>
          <Animated.View style={[styles.cardContainer, frontAnimatedStyle]}>{renderFront()}</Animated.View>
          <Animated.View style={[styles.cardContainer, styles.cardBack, backAnimatedStyle]}>{renderBack()}</Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 1,
  },
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  backContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  logoContainer: {
    position: 'absolute',
    right: 30,
    top: 142,
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  cardDetailsWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    height: CARD_HEIGHT - 100,
    paddingHorizontal: 30,
    paddingBottom: 20,
    gap: 20,
  },
  cardNumberContainer: {
    alignItems: 'flex-end',
  },
  cardNumber: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  cardDetailsContainer: {
    alignItems: 'flex-end',
    gap: 15,
  },
  detailRow: {
    alignItems: 'flex-end',
  },
  detailLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '800',
  },
  copyButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default CardFlipComponent;
