import { View, Text, Image, Button, XStack, YStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { StyleSheet, Dimensions, TouchableOpacity, Switch } from 'react-native';
import { getCardAssets, getCardTheme, getLuminance, CARD_ASPECT_RATIO } from '@/utils/cardUtils';
import { CalendarIcon } from 'react-native-heroicons/solid';
import { PauseIcon, PlayIcon, CreditCardIcon } from 'react-native-heroicons/solid';
import { BlurView } from 'expo-blur';
import { MERCHANT_LOGOS, MERCHANT_BACKGROUNDS } from '@/data/merchants';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/utils';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import BottomSheet from '@/components/BottomSheet';
import { getHidePauseWarning, setHidePauseWarning } from '@/utils/storage';
import { useState, useEffect } from 'react';

const PatternBackground = ({ merchant, opacity = 0.1 }) => {
  const pattern = MERCHANT_BACKGROUNDS[merchant];
  if (!pattern) return null;

  // Create a 6x8 grid of smaller logos
  return (
    <View position="absolute" width="100%" height="100%" opacity={opacity} ai="center" jc="center">
      {Array.from({ length: 48 }).map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        return (
          <Image
            key={i}
            source={pattern}
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              top: row * 40,
              left: col * 50,
              opacity: 0.7,
              tintColor: 'white',
            }}
            resizeMode="contain"
          />
        );
      })}
    </View>
  );
};

const SubscriptionCard = ({ subscription, onToggle }) => {
  const colors = useColors();
  const navigation = useNavigation();
  const { merchant, amount, nextChargeDate, isActive, cardId, cardName, isCardPaused } = subscription;
  const [showPauseWarning, setShowPauseWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);

  // Check if we should show the warning
  useEffect(() => {
    if (pendingToggle) {
      // If resuming, proceed directly without warning
      if (isCardPaused) {
        handleConfirmToggle();
        return;
      }

      // For pausing, check if we should show warning
      getHidePauseWarning().then((hideWarning) => {
        if (hideWarning) {
          handleConfirmToggle();
        } else {
          setShowPauseWarning(true);
        }
      });
    }
  }, [pendingToggle]);

  // Get merchant logo
  const logo = MERCHANT_LOGOS[merchant];
  if (!logo) return null; // Don't render if we don't have a logo for this merchant

  // Get card theme and colors
  const backgroundColor = Colors.cards[merchant.toLowerCase().replace(/[^a-z0-9]/g, '')] || colors.primary;
  const cardTheme = getCardTheme(backgroundColor);
  const textColor = cardTheme === 'dark' ? '#000000' : '#FFFFFF';

  // Calculate the scale needed to fill the width while maintaining aspect ratio
  const cardWidth = 300;
  const cardHeight = 200;
  const scale = cardWidth / (cardHeight * CARD_ASPECT_RATIO);

  const handleToggle = (e) => {
    // Stop the event from bubbling up to the card press
    e.stopPropagation();
    setPendingToggle(true);
  };

  const handleConfirmToggle = async () => {
    // Save preference if user chose not to show warning again
    if (dontShowAgain) {
      await setHidePauseWarning(true);
    }

    // Perform the toggle
    if (onToggle && cardId) {
      onToggle(cardId);
    }

    // Reset states
    setShowPauseWarning(false);
    setPendingToggle(false);
    setDontShowAgain(false);
  };

  const handleCancelToggle = () => {
    setShowPauseWarning(false);
    setPendingToggle(false);
    setDontShowAgain(false);
  };

  const handleCardPress = () => {
    navigation.navigate(Paths.CARD_DETAILS, { cardId });
  };

  // Format the next charge date
  const formattedNextChargeDate = format(new Date(nextChargeDate), 'MMM d, yyyy');

  return (
    <>
      <TouchableOpacity activeOpacity={0.7} onPress={handleCardPress}>
        <View
          width={cardWidth}
          height={cardHeight}
          borderRadius={20}
          overflow="hidden"
          backgroundColor={backgroundColor}
          marginRight={16}
        >
          {/* Dimming Overlay */}
          {isCardPaused && (
            <BlurView
              intensity={10}
              tint="dark"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'dark',
                  zIndex: 1,
                },
              ]}
            />
          )}

          {/* Background Pattern */}
          <PatternBackground merchant={merchant} opacity={isCardPaused ? 0.05 : 0.1} />

          {/* Content */}
          <View flex={1} padding={20} justifyContent="space-between" zIndex={1}>
            {/* Top Section with Logo and Pause Button */}
            <XStack jc="space-between" ai="center">
              <Image
                source={logo}
                style={{
                  width: 120,
                  height: 50,
                  resizeMode: 'contain',
                  tintColor: textColor,
                  opacity: isCardPaused ? 0.7 : 1,
                }}
              />
              <View
                style={{
                  overflow: 'hidden',
                  borderRadius: 10,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: `${textColor}40`,
                  zIndex: 2,
                }}
              >
                <BlurView intensity={10} tint={cardTheme === 'dark' ? 'dark' : 'light'}>
                  <TouchableOpacity
                    onPress={handleToggle}
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    {isCardPaused ? (
                      <PlayIcon size={20} color={textColor} />
                    ) : (
                      <PauseIcon size={20} color={textColor} />
                    )}
                  </TouchableOpacity>
                </BlurView>
              </View>
            </XStack>

            {/* Bottom Section */}
            <View gap={4}>
              {/* Card Badge */}
              <View
                style={{
                  overflow: 'hidden',
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: `${textColor}40`,
                  marginBottom: 4,
                }}
              >
                <BlurView intensity={10} tint={cardTheme === 'dark' ? 'dark' : 'light'}>
                  <View px="$3" py="$1.5">
                    <Text color={textColor} fontSize={12} fontWeight="600" opacity={0.9}>
                      {cardName}
                    </Text>
                  </View>
                </BlurView>
              </View>

              <Text
                color={textColor}
                fontSize={28}
                fontWeight="700"
                fontFamily={'$archivoBlack'}
                opacity={isCardPaused ? 0.7 : 1}
              >
                {formatCurrency(amount)}
              </Text>
              <View flexDirection="row" alignItems="center" gap={4}>
                <CalendarIcon size={16} color={`${textColor}CC`} opacity={isCardPaused ? 0.7 : 1} />
                <Text color={`${textColor}CC`} fontSize={14} fontWeight={'500'} opacity={isCardPaused ? 0.7 : 1}>
                  Next billing date: {formattedNextChargeDate}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Pause Warning Sheet */}
      <BottomSheet isOpen={showPauseWarning} onClose={handleCancelToggle}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Pause Card
          </Text>

          <Text color={colors.textSecondary} fontSize="$4" lineHeight={24}>
            Pausing this card will prevent new transactions, but won't cancel your subscription with the merchant.
            You'll need to cancel that separately.
          </Text>

          <YStack gap="$4" mt="$2">
            {/* Don't show again switch */}
            <XStack ai="center" jc="space-between">
              <Text color={colors.text} fontSize="$3">
                Don't show this warning again
              </Text>
              <Switch
                value={dontShowAgain}
                onValueChange={setDontShowAgain}
                trackColor={{ false: colors.backgroundTertiary, true: colors.primary }}
                thumbColor={colors.background}
                ios_backgroundColor={colors.backgroundTertiary}
              />
            </XStack>

            {/* Action Buttons */}
            <YStack gap="$3">
              <Button
                backgroundColor={colors.primary}
                pressStyle={{ backgroundColor: colors.primaryDark }}
                onPress={handleConfirmToggle}
                size="$5"
                borderRadius={12}
              >
                <Text color="white" fontSize="$4" fontWeight="600">
                  Pause Card
                </Text>
              </Button>

              <Button
                backgroundColor={colors.backgroundSecondary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={handleCancelToggle}
                size="$5"
                borderRadius={12}
                borderWidth={1}
                borderColor={colors.border}
              >
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  Cancel
                </Text>
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </BottomSheet>
    </>
  );
};

export default SubscriptionCard;
