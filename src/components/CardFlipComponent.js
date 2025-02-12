import { StyleSheet, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Text, View, Image, XStack, YStack } from 'tamagui';
import CardComponent from '@/components/CardComponent';
import { Colors } from '@/context/ColorSchemeContext';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { useCards } from '@/hooks/useCards';
import { useRef, useState, useEffect } from 'react';
import { ClipboardDocumentIcon } from 'react-native-heroicons/solid';
import Toast from 'react-native-toast-message';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  getCardTheme,
  getCardAssets,
  formatCardNumber,
  formatExpiryDate,
} from '@/utils/cardUtils';

const AUTO_FLIP_DELAY = 5000;

const CardFlipComponent = ({ cardId }) => {
  const { getCardById } = useCards();
  const card = getCardById(cardId);
  const cardColor = card.cardColor;
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const logoMoveAnim = useRef(new Animated.Value(0)).current;
  const detailsFadeAnim = useRef(new Animated.Value(0)).current;
  const autoFlipTimeout = useRef(null);

  const cardTheme = getCardTheme(cardColor);
  const textColor = cardTheme === 'light' ? 'white' : 'black';
  const { cardImg, logoImg } = getCardAssets(card.cardType.split('_')[0], cardTheme);

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
    if (card.closed) return;

    await Clipboard.setStringAsync(card.cardNumber);
    Toast.show({
      type: 'success',
      text1: 'Card number copied to clipboard',
    });
  };

  const flipCard = () => {
    // Don't allow flipping if card is closed
    if (card.closed) return;

    // Clear any existing timeout when manually flipping
    if (autoFlipTimeout.current) {
      clearTimeout(autoFlipTimeout.current);
    }

    const toValue = isFlipped ? 0 : 180;
    const preFlipValue = isFlipped ? 225 : -45;

    Animated.sequence([
      Animated.spring(flipAnim, {
        toValue,
        useNativeDriver: true,
        tension: 10,
        friction: 10,
        velocity: isFlipped ? -10 : 10,
        restSpeedThreshold: 100,
        restDisplacementThreshold: 40,
        overshootClamping: true,
      }),
    ]).start(() => {
      setIsFlipped(!isFlipped);

      if (!isFlipped) {
        // Start secondary animations
        Animated.spring(logoMoveAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start();
        Animated.spring(detailsFadeAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start();
      } else {
        // Reset animations when flipping to front
        logoMoveAnim.setValue(0);
        detailsFadeAnim.setValue(0);
      }
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [-45, 0, 180, 225],
    outputRange: ['-45deg', '0deg', '180deg', '225deg'],
    extrapolate: 'clamp',
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [-45, 0, 180, 225],
    outputRange: ['225deg', '180deg', '360deg', '405deg'],
    extrapolate: 'clamp',
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
  };

  const logoTranslateY = logoMoveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -110],
  });

  const renderFront = () => {
    return <CardComponent cardId={cardId} />;
  };

  const renderBack = () => {
    const cardNumberSegments = formatCardNumber(card.cardNumber);

    return (
      <View w={CARD_WIDTH} h={CARD_HEIGHT} borderRadius={15} bg={cardColor} overflow="hidden">
        <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />
        <View f={1} jc="flex-end" ai="flex-end">
          {/* Animated Logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoTranslateY }] }]}>
            <Image source={logoImg} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          {/* Animated Card Details */}
          <Animated.View style={[{ opacity: detailsFadeAnim }]}>
            <YStack ai="flex-end" jc="space-between" w="100%" h={CARD_HEIGHT - 100} px="$6" pb="$6" pt="$2" gap="$5">
              <View ai="flex-end">
                <XStack ai="flex-end" gap="$3">
                  <View>
                    {cardNumberSegments.map((segment, index) => (
                      <Text
                        key={index}
                        fos={28}
                        fontWeight="900"
                        ls={2}
                        fontStyle="italic"
                        fontFamily={'$archivoBlack'}
                        color={textColor}
                        textAlign="right"
                        letterSpacing={0.5}
                      >
                        {segment}
                      </Text>
                    ))}
                  </View>
                </XStack>
              </View>
              <YStack ai="flex-end" gap="$4">
                <YStack ai="flex-end">
                  <Text color={textColor} fos={12} mb="$1" fontWeight="600">
                    Expiry Date
                  </Text>
                  <Text color={textColor} fos={16} fontWeight="800">
                    {formatExpiryDate(card.expiryDate)}
                  </Text>
                </YStack>
                <YStack ai="flex-end">
                  <Text color={textColor} fos={12} mb="$1" fontWeight="600">
                    CVV
                  </Text>
                  <Text color={textColor} fos={16} fontWeight="800">
                    {card.cvv}
                  </Text>
                </YStack>
              </YStack>
            </YStack>
          </Animated.View>

          {/* Copy Button */}
          {isFlipped && (
            <TouchableOpacity onPress={handleCopyCardNumber} style={styles.copyButton} hitSlop={10}>
              <BlurView intensity={10} tint={'regular'} style={styles.blurView}>
                <ClipboardDocumentIcon size={14} color={textColor} />
                <Text color={textColor} fos={12} fontWeight="600" ml="$2">
                  Copy
                </Text>
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View w={CARD_WIDTH} h={CARD_HEIGHT} zi={1}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View w={CARD_WIDTH} h={CARD_HEIGHT} pos="relative" jc="center" ai="center" opacity={card.closed ? 0.7 : 1}>
          <Animated.View style={[styles.cardContainer, frontAnimatedStyle]}>{renderFront()}</Animated.View>
          <Animated.View style={[styles.cardContainer, styles.cardBack, backAnimatedStyle]}>
            {renderBack()}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
  copyButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 1,
  },
  blurView: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default CardFlipComponent;
