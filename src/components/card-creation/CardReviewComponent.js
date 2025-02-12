import { StyleSheet } from 'react-native';
import { View, Text, XStack, Button, YStack, Separator } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import CardComponent from '@/components/CardComponent';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useCardMutations } from '@/hooks/useCardMutations';
import { CARD_DEFAULTS } from '@/api/cards';
import BottomSheet from '@/components/BottomSheet';
import { CARD_HEIGHT } from '@/utils/cardUtils';
import { PaintBrushIcon, FaceSmileIcon } from 'react-native-heroicons/solid';
import { BanknotesIcon, MapPinIcon, TagIcon, FireIcon, BuildingStorefrontIcon } from 'react-native-heroicons/outline';
import EmojiPicker from 'rn-emoji-keyboard';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import { useUser } from '@/hooks/useUser';
import { formatCurrency } from '@/utils/utils';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';

const LIMIT_LABELS = {
  per_transaction: 'Per Transaction',
  per_day: 'Per Day',
  per_week: 'Per Week',
  per_month: 'Per Month',
  per_year: 'Per Year',
  total: 'Total',
  no_limit: 'No Limit',
};

const CardReviewComponent = ({ cardType, cardData, onBack, onCreateCard }) => {
  const colors = useColors();
  const { issuanceLimit } = useUser();
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [emoji, setEmoji] = useState(cardData.icon || CARD_DEFAULTS[cardType]?.icon || '💳');
  const [cardColor, setCardColor] = useState(cardData.color || CARD_DEFAULTS[cardType]?.color || Colors.cards.blue);
  const insets = useSafeAreaInsets();
  const {
    createBurnerCardMutation,
    createCategoryCardMutation,
    createMerchantCardMutation,
    createLocationCardMutation,
  } = useCardMutations();

  // Animation values
  const cardScale = useSharedValue(0.8);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // Animate on mount
  useEffect(() => {
    cardScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
    contentOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      })
    );
    contentTranslateY.value = withDelay(
      200,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, []);

  // Animation styles
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  // Function to format limit value
  const formatLimit = (value) => {
    if (value === null) return 'No Limit';
    return `${value.toLocaleString()} KWD`;
  };

  // Get all non-null limits
  const getActiveLimits = () => {
    if (!cardData.limits) return [];
    return Object.entries(cardData.limits)
      .filter(([key, value]) => {
        // Include if it's either a number greater than 0 or explicitly set to null (no limit)
        return (typeof value === 'number' && value > 0) || value === null;
      })
      .map(([key, value]) => ({
        label: LIMIT_LABELS[key] || key,
        value: formatLimit(value),
      }))
      .sort((a, b) => {
        // Custom sort order: Per Transaction -> Per Day -> Per Week -> Per Month -> Per Year -> Total -> No Limit
        const order = {
          'Per Transaction': 1,
          'Per Day': 2,
          'Per Week': 3,
          'Per Month': 4,
          'Per Year': 5,
          Total: 6,
          'No Limit': 7,
        };
        return order[a.label] - order[b.label];
      });
  };

  const activeLimits = getActiveLimits();

  const handleEmojiSelected = ({ emoji: selectedEmoji }) => {
    setEmoji(selectedEmoji);
    cardData.cardIcon = selectedEmoji;
    setShowEmojiPicker(false);
  };

  const handleColorSelected = ({ hex }) => {
    setCardColor(hex);
    cardData.cardColor = hex;
  };

  const handleBack = () => {
    // Animate out
    cardScale.value = withTiming(0.8, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    contentOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
    contentTranslateY.value = withTiming(50, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });

    // Delay the actual navigation to allow animations to complete
    setTimeout(onBack, 300);
  };

  const handleCreateCard = () => {
    // Animate out with a different effect
    cardScale.value = withSequence(
      withSpring(1.1, {
        damping: 15,
        stiffness: 100,
      }),
      withSpring(1, {
        damping: 15,
        stiffness: 100,
      })
    );
    contentOpacity.value = withTiming(0.5, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });

    // Show confirmation after animation
    setTimeout(() => {
      setShowCreateConfirm(true);
    }, 300);
  };

  const handleCancelCreate = () => {
    setShowCreateConfirm(false);

    // Reverse animations to bring back the card review
    cardScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
    contentOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  };

  const handleConfirmCreate = async () => {
    setShowCreateConfirm(false);

    // Final animation before creating card
    cardScale.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    contentOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });

    try {
      // Create the final card data with the current emoji and color
      const finalCardData = {
        ...cardData,
        icon: emoji,
        color: cardColor,
      };

      console.log('finalCardData', finalCardData);

      // Call the appropriate mutation based on card type
      switch (cardType) {
        case 'BURNER':
          await createBurnerCardMutation.mutateAsync(finalCardData);
          break;
        case 'CATEGORY_LOCKED':
          await createCategoryCardMutation.mutateAsync(finalCardData);
          break;
        case 'MERCHANT_LOCKED':
          await createMerchantCardMutation.mutateAsync(finalCardData);
          break;
        case 'LOCATION_LOCKED':
          await createLocationCardMutation.mutateAsync(finalCardData);
          break;
      }

      onCreateCard(finalCardData);
    } catch (error) {
      // Error is already handled by the mutation
      // If there's an error, bring back the card review
      // handleCancelCreate();
    }
  };

  // Get card preview data
  const cardPreviewData = {
    type: cardType,
    label: cardData.name,
    emoji: emoji,
    lastFourDigits: '••••',
    backgroundColor: cardColor,
    isPaused: false,
    isClosed: false,
  };

  // Get type-specific icon
  const getTypeIcon = () => {
    switch (cardType) {
      case 'BURNER':
        return FireIcon;
      case 'MERCHANT_LOCKED':
        return BuildingStorefrontIcon;
      case 'CATEGORY_LOCKED':
        return TagIcon;
      case 'LOCATION_LOCKED':
        return MapPinIcon;
      default:
        return BanknotesIcon;
    }
  };
  const TypeIcon = getTypeIcon();

  // Helper to format card type title
  const formatCardType = (type) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get active spending limit
  const getActiveLimit = () => {
    if (!cardData.limits) return null;
    const limits = [
      { type: 'per_transaction', value: cardData.limits.per_transaction },
      { type: 'per_day', value: cardData.limits.per_day },
      { type: 'per_week', value: cardData.limits.per_week },
      { type: 'per_month', value: cardData.limits.per_month },
      { type: 'per_year', value: cardData.limits.per_year },
      { type: 'total', value: cardData.limits.total },
    ];
    return limits.find((limit) => limit.value !== null && limit.value > 0);
  };

  const activeLimit = getActiveLimit();

  return (
    <View f={1} bg={colors.background}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <YStack>
          <YStack gap="$1" ai="center" pt="$3" mb="$5">
            <Animated.View style={cardStyle}>
              <View height={'auto'} overflow="hidden" borderRadius={15} w="100%">
                <View ai="center">
                  <CardComponent scale={0.8} displayData={cardPreviewData} />
                </View>
              </View>
            </Animated.View>

            {/* Customization Buttons */}
            <Animated.View style={contentStyle}>
              <XStack mt="$4" gap="$3" ai="center" jc="center" w="100%">
                <Button
                  f={1}
                  size="$3"
                  backgroundColor={colors.backgroundSecondary}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  onPress={() => setShowEmojiPicker(true)}
                  borderWidth={1}
                  borderColor={colors.border}
                  br={8}
                  px="$3"
                >
                  <FaceSmileIcon size={16} color={colors.text} />
                  <Text color={colors.text} fontSize="$2" fontWeight="600">
                    Change Icon
                  </Text>
                </Button>
                <Button
                  f={1}
                  size="$3"
                  backgroundColor={colors.backgroundSecondary}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  onPress={() => setShowColorWheel(true)}
                  borderWidth={1}
                  borderColor={colors.border}
                  br={8}
                  px="$3"
                >
                  <PaintBrushIcon size={16} color={colors.text} />
                  <Text color={colors.text} fontSize="$2" fontWeight="600">
                    Change Color
                  </Text>
                </Button>
              </XStack>
            </Animated.View>
          </YStack>

          <Animated.View style={contentStyle}>
            <YStack gap="$5">
              {/* Card Summary */}
              <View
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: colors.backgroundSecondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <YStack p="$4" gap="$4">
                  <XStack ai="center" gap="$2">
                    <TypeIcon size={20} color={colors.text} />
                    <Text color={colors.text} fontSize="$4" fontWeight="600" fontFamily="$heading">
                      {formatCardType(cardType)}
                    </Text>
                  </XStack>

                  <YStack gap="$3">
                    <XStack jc="space-between">
                      <Text color={colors.textSecondary} fontSize="$3">
                        Card Name
                      </Text>
                      <Text color={colors.text} fontSize="$3" fontWeight="600">
                        {cardData.name}
                      </Text>
                    </XStack>

                    {activeLimit && (
                      <XStack jc="space-between">
                        <Text color={colors.textSecondary} fontSize="$3">
                          Spending Limit
                        </Text>
                        <YStack ai="flex-end">
                          <Text color={colors.text} fontSize="$3" fontWeight="600">
                            {formatCurrency(activeLimit.value)}
                          </Text>
                          <Text color={colors.textSecondary} fontSize="$2">
                            {LIMIT_LABELS[activeLimit.type]}
                          </Text>
                        </YStack>
                      </XStack>
                    )}

                    {cardType === 'LOCATION_LOCKED' && cardData.location && (
                      <>
                        <XStack jc="space-between">
                          <Text color={colors.textSecondary} fontSize="$3">
                            Location
                          </Text>
                          <Text
                            color={colors.text}
                            fontSize="$3"
                            fontWeight="600"
                            maxWidth="60%"
                            textAlign="right"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {cardData.location?.address?.split(', ')[0] || 'Select location'}
                          </Text>
                        </XStack>
                        <XStack jc="space-between">
                          <Text color={colors.textSecondary} fontSize="$3">
                            Radius
                          </Text>
                          <Text color={colors.text} fontSize="$3" fontWeight="600">
                            {cardData.radius.toFixed(1)} km
                          </Text>
                        </XStack>
                      </>
                    )}

                    {cardType === 'CATEGORY_LOCKED' && cardData.category && (
                      <XStack jc="space-between">
                        <Text color={colors.textSecondary} fontSize="$3">
                          Category
                        </Text>
                        <XStack gap="$2" ai="center">
                          <Text fontSize="$3">{cardData.category.emoji}</Text>
                          <Text color={colors.text} fontSize="$3" fontWeight="600">
                            {cardData.category.name}
                          </Text>
                        </XStack>
                      </XStack>
                    )}
                  </YStack>
                </YStack>
              </View>

              {/* Card Generation Info */}
              {issuanceLimit && (
                <View
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: colors.backgroundSecondary,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <YStack p="$4" gap="$4">
                    <Text color={colors.text} fontSize="$4" fontWeight="600" fontFamily="$heading">
                      Card Generation
                    </Text>

                    <YStack gap="$3">
                      <XStack jc="space-between">
                        <Text color={colors.textSecondary} fontSize="$3">
                          Monthly Usage
                        </Text>
                        <Text color={colors.text} fontSize="$3" fontWeight="600">
                          {issuanceLimit.currentMonthUsage} / {issuanceLimit.monthlyLimit}
                        </Text>
                      </XStack>
                      <View h={4} br={2} bg={`${colors.primary}20`} overflow="hidden">
                        <View
                          h="100%"
                          w={`${(issuanceLimit.currentMonthUsage / issuanceLimit.monthlyLimit) * 100}%`}
                          bg={colors.primary}
                        />
                      </View>
                    </YStack>
                  </YStack>
                </View>
              )}
            </YStack>
          </Animated.View>
        </YStack>

        {/* Bottom Buttons */}
        <Animated.View style={contentStyle}>
          <XStack
            width="100%"
            gap="$4"
            borderTopWidth={1}
            borderTopColor={`${colors.border}40`}
            pt="$4"
            mt="auto"
            mb={insets.bottom + 50}
            jc="space-between"
          >
            <Button
              flex={1}
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={handleBack}
              size="$5"
              borderRadius={15}
              borderWidth={1}
              borderColor={colors.border}
            >
              <Text color={colors.text} fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Back
              </Text>
            </Button>
            <Button
              flex={1}
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={handleCreateCard}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Create Card
              </Text>
            </Button>
          </XStack>
        </Animated.View>
      </ScrollView>

      {/* Create Card Confirmation Sheet */}
      <BottomSheet isOpen={showCreateConfirm} onClose={handleCancelCreate}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Create Card
          </Text>
          <Text color={colors.textSecondary} fontSize="$4">
            Are you sure you want to create this {formatCardType(cardType).toLowerCase()} card? You have{' '}
            {issuanceLimit ? issuanceLimit.monthlyLimit - issuanceLimit.currentMonthUsage : 0} generations remaining
            this month.
          </Text>
          <YStack gap="$3">
            <Button
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={handleConfirmCreate}
              size="$5"
              borderRadius={12}
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                Create Card
              </Text>
            </Button>
            <Button
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={handleCancelCreate}
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
      </BottomSheet>

      {/* Emoji Picker Sheet */}
      <EmojiPicker
        onEmojiSelected={handleEmojiSelected}
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        categoryPosition="bottom"
        enableSearchBar
        theme={{
          backdrop: `${colors.background}88`,
          knob: colors.primary,
          container: colors.backgroundSecondary,
          header: colors.text,
          skinTonesContainer: colors.backgroundTertiary,
          category: {
            icon: colors.textSecondary,
            iconActive: colors.text,
            container: colors.backgroundSecondary,
            containerActive: colors.primary,
          },
          search: {
            text: colors.text,
            placeholder: colors.textTertiary,
            icon: colors.text,
            background: colors.backgroundTertiary,
            border: colors.border,
          },
        }}
      />

      {/* Color Picker Sheet */}
      <BottomSheet isOpen={showColorWheel} onClose={() => setShowColorWheel(false)}>
        <YStack gap="$5" px="$4" mt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily={'$archivoBlack'}>
            Custom Color
          </Text>

          <ColorPicker style={{ width: '100%' }} value={cardColor} onComplete={handleColorSelected}>
            <Preview style={{ height: 40, borderRadius: 8 }} hideInitialColor />
            <YStack gap="$4" mt="$4">
              <Panel1 />
              <HueSlider />
            </YStack>
          </ColorPicker>

          <YStack gap="$3">
            <Button
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={() => setShowColorWheel(false)}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Select
              </Text>
            </Button>
          </YStack>
        </YStack>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
});

export default CardReviewComponent;
