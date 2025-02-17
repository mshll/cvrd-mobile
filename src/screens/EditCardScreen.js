import { View, Text, YStack, XStack, Button, Input, Circle, Slider } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PlusIcon, ArrowPathIcon } from 'react-native-heroicons/solid';
import { useCards } from '@/hooks/useCards';
import { useCardMutations } from '@/hooks/useCardMutations';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import CardComponent from '@/components/CardComponent';
import { CARD_HEIGHT } from '@/utils/cardUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import BottomSheet from '@/components/BottomSheet';
import { getCardCustomization, saveCardCustomization, resetCardCustomization, Defaults } from '@/utils/storage';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditCardScreen = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { cardId } = route.params;
  const { getCardById } = useCards();
  const { updateCardMutation } = useCardMutations();
  const card = getCardById(cardId);

  // State management
  const [cardName, setCardName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [cardColor, setCardColor] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [customEmojiIndex, setCustomEmojiIndex] = useState(-1);
  const [customColorIndex, setCustomColorIndex] = useState(-1);
  const [emojiGrid, setEmojiGrid] = useState(Defaults.emojis);
  const [colorGrid, setColorGrid] = useState(Defaults.colors);

  // Initialize state with card data
  useEffect(() => {
    if (card) {
      setCardName(card.cardName || '');
      setEmoji(card.cardIcon || Defaults.EMOJI);
      setCardColor(card.cardColor || Defaults.COLOR);
    }
  }, [card]);

  // Load saved customizations
  useEffect(() => {
    if (!card) return;

    getCardCustomization(cardId).then(({ emojis, colors }) => {
      setEmojiGrid(emojis);
      setColorGrid(colors);
    });
  }, [cardId]);

  // Handlers
  const handleEmojiSelected = useCallback(
    ({ emoji }) => {
      setEmoji(emoji);
      if (customEmojiIndex >= 0) {
        setEmojiGrid((prev) => {
          const newGrid = [...prev];
          newGrid[customEmojiIndex] = emoji;
          saveCardCustomization(cardId, newGrid, colorGrid);
          return newGrid;
        });
      }
      setShowEmojiPicker(false);
    },
    [cardId, customEmojiIndex, colorGrid]
  );

  const handleColorSelected = useCallback(({ hex }) => {
    setCustomColor(hex);
  }, []);

  const handleColorSave = useCallback(() => {
    if (customColorIndex >= 0) {
      setColorGrid((prev) => {
        const newGrid = [...prev];
        newGrid[customColorIndex].value = customColor;
        saveCardCustomization(cardId, emojiGrid, newGrid);
        return newGrid;
      });
    }
    setCardColor(customColor);
    setShowColorWheel(false);
  }, [cardId, customColor, customColorIndex, emojiGrid]);

  const resetToDefaults = useCallback(async () => {
    try {
      if (!card) return;

      // First reset the customization in storage
      const defaultCustomization = await resetCardCustomization(cardId);

      // Then update all states in a specific order
      setCustomEmojiIndex(-1);
      setCustomColorIndex(-1);

      // Update grids first
      setEmojiGrid(defaultCustomization.emojis);
      setColorGrid(defaultCustomization.colors);

      // Then update the selected values
      setEmoji(card.cardIcon || Defaults.EMOJI);
      setCardColor(card.cardColor || Defaults.COLOR);
      setCardName(card.cardName || '');

      // Reset color picker
      setCustomColor('#000000');
      setShowColorWheel(false);
      setShowEmojiPicker(false);
    } catch (error) {
      console.log('Failed to reset customizations:', error);
    }
  }, [cardId, card]);

  const handleSave = useCallback(() => {
    if (!card) return;
    if (card.closed) {
      Toast.show({
        type: 'error',
        text1: 'Cannot Update Card',
        text2: 'This card is closed and cannot be modified',
      });
      return;
    }

    const updates = {};
    if (cardName !== card.cardName) updates.cardName = cardName;
    if (emoji !== card.cardIcon) updates.cardIcon = emoji;
    if (cardColor !== card.cardColor) updates.cardColor = cardColor;

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      updateCardMutation.mutate(
        { cardId, updates },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        }
      );
    } else {
      navigation.goBack();
    }
  }, [cardId, card, cardName, emoji, cardColor, updateCardMutation, navigation]);

  // Show loading state if card not found
  if (!card) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Text color={colors.text} fontSize="$5" textAlign="center" mb="$4">
          Card not found
        </Text>
        <Button
          onPress={() => navigation.goBack()}
          backgroundColor={colors.primary}
          pressStyle={{ backgroundColor: colors.primaryDark }}
        >
          <Text color="white">Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <View f={1} backgroundColor={colors.background}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" gap="$4" pb="$8" jc="space-between" f={1}>
          <YStack gap="$4" f={1}>
            {/* Card Preview */}
            <YStack gap="$1" ai="center" pt="$3">
              <View height={5} width={60} backgroundColor={colors.backgroundTertiary} borderRadius={50} />

              <View
                height={CARD_HEIGHT * 0.3}
                overflow="hidden"
                borderTopEndRadius={20}
                borderTopStartRadius={20}
                pt="$4"
                w="100%"
              >
                <View scale={1.15} transformOrigin="top" perspectiveOrigin="top" ai="center">
                  <CardComponent
                    scale={1.2}
                    displayData={{
                      type: card?.cardType || 'Burner',
                      label: cardName,
                      emoji: emoji,
                      lastFourDigits: card?.cardNumber?.slice(-4) || '1234',
                      backgroundColor: cardColor,
                      isPaused: card?.paused || false,
                      isClosed: card?.closed || false,
                    }}
                  />
                </View>
              </View>
            </YStack>

            {/* Card Name */}
            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Card Name
              </Text>
              <Input
                value={cardName}
                onChangeText={setCardName}
                placeholder="Enter card name"
                backgroundColor={colors.backgroundSecondary}
                borderWidth={1}
                borderColor={colors.border}
                color={colors.text}
                placeholderTextColor={colors.textTertiary}
                fontSize="$4"
                p={0}
                px="$4"
                fontWeight="700"
                borderRadius={12}
                disabled={card.closed}
              />
            </YStack>

            {/* Emoji Grid */}
            <YStack gap="$2" width="100%">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Card Icon
              </Text>
              <XStack width="100%" flexWrap="wrap" gap="$2" jc="space-between">
                {emojiGrid.map((emojiItem, index) => (
                  <Button
                    key={index}
                    width="15%"
                    aspectRatio={1}
                    borderRadius={12}
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={emoji === emojiItem ? colors.primary : colors.border}
                    pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                    onPress={() => !card.closed && setEmoji(emojiItem)}
                    p={0}
                    disabled={card.closed}
                    opacity={card.closed ? 0.5 : 1}
                  >
                    <Text fontSize={24}>{emojiItem}</Text>
                  </Button>
                ))}
                <Button
                  width="15%"
                  aspectRatio={1}
                  borderRadius={12}
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={colors.border}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  onPress={() => {
                    if (card.closed) return;
                    const lastSelectedIndex = emojiGrid.indexOf(emoji);
                    setCustomEmojiIndex(lastSelectedIndex >= 0 ? lastSelectedIndex : 0);
                    setShowEmojiPicker(true);
                  }}
                  p={0}
                  ai="center"
                  jc="center"
                  disabled={card.closed}
                  opacity={card.closed ? 0.5 : 1}
                >
                  <PlusIcon size={20} color={colors.text} />
                </Button>
              </XStack>
            </YStack>

            {/* Color Grid */}
            <YStack gap="$2" width="100%">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Card Color
              </Text>
              <XStack width="100%" flexWrap="wrap" gap="$2" jc="space-between">
                {colorGrid.map((color, index) => (
                  <Button
                    key={color.name}
                    width="15%"
                    aspectRatio={1}
                    borderRadius={1000}
                    backgroundColor={color.name === 'custom' ? colors.backgroundTertiary : color.value}
                    pressStyle={{ opacity: 0.8 }}
                    m={0}
                    p={0}
                    ai="center"
                    jc="center"
                    onPress={() => {
                      if (card.closed) return;
                      if (color.name === 'custom') {
                        const lastSelectedIndex = colorGrid.findIndex((c) => c.value === cardColor);
                        setCustomColorIndex(lastSelectedIndex >= 0 ? lastSelectedIndex : 0);
                        setShowColorWheel(true);
                      } else {
                        setCardColor(color.value);
                      }
                    }}
                    borderWidth={cardColor === color.value ? 2 : 0}
                    borderColor={colors.primary}
                    disabled={card.closed}
                    opacity={card.closed ? 0.5 : 1}
                  >
                    {color.name === 'custom' ? (
                      <PlusIcon size={20} color={colors.text} />
                    ) : (
                      <Circle
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        borderWidth={cardColor === color.value ? 2 : 0}
                        borderColor={colors.background}
                      />
                    )}
                  </Button>
                ))}
              </XStack>
            </YStack>
          </YStack>

          {/* Reset Button */}
          {!card.closed && (
            <Button
              backgroundColor={'transparent'}
              pressStyle={{ opacity: 0.7 }}
              onPress={resetToDefaults}
              size="$3"
              borderRadius={8}
              flexDirection="row"
              gap="$1"
              mb="-$2"
              borderWidth={0}
            >
              <ArrowPathIcon size={16} color={colors.primary} />
              <Text color={colors.primary} fontSize="$3" fontWeight="600">
                Reset to Default
              </Text>
            </Button>
          )}

          {/* Bottom Buttons */}
          <YStack
            width="100%"
            gap="$2.5"
            borderTopWidth={1}
            borderTopColor={colors.border}
            pt="$4"
            mt="$4"
            pb={insets.bottom + 15}
          >
            <Button
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={handleSave}
              size="$5"
              borderRadius={12}
              disabled={card.closed}
              opacity={card.closed ? 0.5 : 1}
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                Save
              </Text>
            </Button>
            <Button
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => navigation.goBack()}
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
      </ScrollView>

      <BottomSheet isOpen={showColorWheel} onClose={() => setShowColorWheel(false)}>
        <YStack gap="$5" px="$4" mt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily={'$archivoBlack'}>
            Custom Color
          </Text>

          <ColorPicker style={{ width: '100%' }} value={customColor} onComplete={handleColorSelected}>
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
              onPress={handleColorSave}
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
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export default EditCardScreen;
