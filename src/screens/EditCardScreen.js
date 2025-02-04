import { View, Text, YStack, XStack, Button, Input, Circle, Slider } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PlusIcon, ArrowPathIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { useCards } from '@/hooks/useCards';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import CardComponent from '@/components/CardComponent';
import { CARD_HEIGHT } from '@/utils/cardUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import BottomSheet from '@/components/BottomSheet';
import { getCardCustomization, saveCardCustomization, resetCardCustomization, Defaults } from '@/utils/storage';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';

const MAP_HEIGHT = 200;
const DEFAULT_RADIUS = 0.3; // in miles
const MAX_RADIUS = 5; // in miles
const RADIUS_MULTIPLIER = 10; // To convert between slider integers and actual radius values

const EditCardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cardId } = route.params;
  const { getCardById, updateCard } = useCards();
  const card = getCardById(cardId);

  // State management
  const [cardName, setCardName] = useState(card?.card_name || '');
  const [emoji, setEmoji] = useState(card?.card_icon || Defaults.EMOJI);
  const [cardColor, setCardColor] = useState(card?.card_color || Defaults.COLOR);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [customEmojiIndex, setCustomEmojiIndex] = useState(-1);
  const [customColorIndex, setCustomColorIndex] = useState(-1);
  const [emojiGrid, setEmojiGrid] = useState(Defaults.emojis);
  const [colorGrid, setColorGrid] = useState(Defaults.colors);

  // Load saved customizations
  useEffect(() => {
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
      // First reset the customization in storage
      const defaultCustomization = await resetCardCustomization(cardId);

      // Then update all states in a specific order
      setCustomEmojiIndex(-1);
      setCustomColorIndex(-1);

      // Update grids first
      setEmojiGrid(defaultCustomization.emojis);
      setColorGrid(defaultCustomization.colors);

      // Then update the selected values
      setEmoji(Defaults.EMOJI);
      setCardColor(Defaults.COLOR);

      // Reset color picker
      setCustomColor('#000000');
      setShowColorWheel(false);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to reset customizations:', error);
    }
  }, [cardId]);

  const handleSave = useCallback(() => {
    const updates = {
      card_name: cardName,
      card_icon: emoji,
      card_color: cardColor,
    };

    updateCard(cardId, updates);
    navigation.goBack();
  }, [cardId, cardName, emoji, cardColor, updateCard, navigation]);

  return (
    <View f={1} backgroundColor={Colors.dark.background}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" gap="$4" pb="$8" jc="space-between" f={1}>
          <YStack gap="$4" f={1}>
            {/* Card Preview */}
            <YStack gap="$1" ai="center" pt="$3">
              <View height={5} width={60} backgroundColor={Colors.dark.backgroundTertiary} borderRadius={50} />

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
                      type: card?.card_type || 'Burner',
                      label: cardName,
                      emoji: emoji,
                      lastFourDigits: card?.card_number?.slice(-4) || '1234',
                      backgroundColor: cardColor,
                      isPaused: card?.is_paused || false,
                      isClosed: card?.is_closed || false,
                    }}
                  />
                </View>
              </View>
            </YStack>

            {/* Card Name */}
            <YStack gap="$2">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Card Name
              </Text>
              <Input
                value={cardName}
                onChangeText={setCardName}
                placeholder="Enter card name"
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={1}
                borderColor={Colors.dark.border}
                color={Colors.dark.text}
                placeholderTextColor={Colors.dark.textTertiary}
                fontSize="$4"
                p={0}
                px="$4"
                fontWeight="700"
                borderRadius={12}
              />
            </YStack>

            {/* Emoji Grid */}
            <YStack gap="$2" width="100%">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Card Icon
              </Text>
              <XStack width="100%" flexWrap="wrap" gap="$2" jc="space-between">
                {emojiGrid.map((emojiItem, index) => (
                  <Button
                    key={index}
                    width="15%"
                    aspectRatio={1}
                    borderRadius={12}
                    backgroundColor={Colors.dark.backgroundSecondary}
                    borderWidth={1}
                    borderColor={emoji === emojiItem ? Colors.dark.primary : Colors.dark.border}
                    pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
                    onPress={() => setEmoji(emojiItem)}
                    p={0}
                  >
                    <Text fontSize={24}>{emojiItem}</Text>
                  </Button>
                ))}
                <Button
                  width="15%"
                  aspectRatio={1}
                  borderRadius={12}
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={1}
                  borderColor={Colors.dark.border}
                  pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
                  onPress={() => {
                    const lastSelectedIndex = emojiGrid.indexOf(emoji);
                    setCustomEmojiIndex(lastSelectedIndex >= 0 ? lastSelectedIndex : 0);
                    setShowEmojiPicker(true);
                  }}
                  p={0}
                  ai="center"
                  jc="center"
                >
                  <PlusIcon size={20} color={Colors.dark.text} />
                </Button>
              </XStack>
            </YStack>

            {/* Color Grid */}
            <YStack gap="$2" width="100%">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Card Color
              </Text>
              <XStack width="100%" flexWrap="wrap" gap="$2" jc="space-between">
                {colorGrid.map((color, index) => (
                  <Button
                    key={color.name}
                    width="15%"
                    aspectRatio={1}
                    borderRadius={1000}
                    backgroundColor={color.value}
                    pressStyle={{ opacity: 0.8 }}
                    m={0}
                    p={0}
                    ai="center"
                    jc="center"
                    onPress={() => {
                      if (color.name === 'custom') {
                        const lastSelectedIndex = colorGrid.findIndex((c) => c.value === cardColor);
                        setCustomColorIndex(lastSelectedIndex >= 0 ? lastSelectedIndex : 0);
                        setShowColorWheel(true);
                      } else {
                        setCardColor(color.value);
                      }
                    }}
                    borderWidth={cardColor === color.value ? 2 : 0}
                    borderColor={Colors.dark.primary}
                  >
                    {color.name === 'custom' ? (
                      <PlusIcon size={20} color={Colors.dark.text} />
                    ) : (
                      <Circle
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        borderWidth={cardColor === color.value ? 2 : 0}
                        borderColor={Colors.dark.background}
                      />
                    )}
                  </Button>
                ))}
              </XStack>
            </YStack>
          </YStack>

          {/* Reset Button */}
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
            <ArrowPathIcon size={16} color={Colors.dark.primary} />
            <Text color={Colors.dark.primary} fontSize="$3" fontWeight="600">
              Reset to Default
            </Text>
          </Button>

          {/* Bottom Buttons */}
          <YStack width="100%" gap="$2.5" borderTopWidth={1} borderTopColor={Colors.dark.border} pt="$4" mt="$4">
            <Button
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={handleSave}
              size="$5"
              borderRadius={12}
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                Save
              </Text>
            </Button>
            <Button
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => navigation.goBack()}
              size="$5"
              borderRadius={12}
              borderWidth={1}
              borderColor={Colors.dark.border}
            >
              <Text color={Colors.dark.text} fontSize="$4" fontWeight="600">
                Cancel
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>

      <BottomSheet isOpen={showColorWheel} onClose={() => setShowColorWheel(false)}>
        <YStack gap="$5" px="$4" mt="$2" pb="$6">
          <Text color={Colors.dark.text} fontSize="$6" fontFamily={'$archivoBlack'}>
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
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
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
          backdrop: `${Colors.dark.background}88`,
          knob: Colors.dark.primary,
          container: Colors.dark.backgroundSecondary,
          header: Colors.dark.text,
          skinTonesContainer: Colors.dark.backgroundTertiary,
          category: {
            icon: Colors.dark.textSecondary,
            iconActive: Colors.dark.text,
            container: Colors.dark.backgroundSecondary,
            containerActive: Colors.dark.primary,
          },
          search: {
            text: Colors.dark.text,
            placeholder: Colors.dark.textTertiary,
            icon: Colors.dark.text,
            background: Colors.dark.backgroundTertiary,
            border: Colors.dark.border,
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
