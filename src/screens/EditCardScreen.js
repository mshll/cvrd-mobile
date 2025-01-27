import { View, Text, YStack, XStack, Button, Input, Circle } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PlusIcon, ArrowPathIcon } from 'react-native-heroicons/solid';
import { useCards } from '@/hooks/useCards';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import CardComponent from '@/components/CardComponent';
import { CARD_HEIGHT } from '@/utils/cardUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import BottomSheet from '@/components/BottomSheet';
import {
  getCardCustomization,
  saveCardCustomization,
  resetCardCustomization,
  DEFAULT_EMOJI,
  DEFAULT_COLOR,
  DEFAULT_EMOJIS,
  DEFAULT_COLORS,
} from '@/utils/storage';

const EditCardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cardId } = route.params;
  const { getCardById, updateCard } = useCards();
  const card = getCardById(cardId);

  const [cardName, setCardName] = useState(card?.card_name || '');
  const [emoji, setEmoji] = useState(card?.card_icon || DEFAULT_EMOJI);
  const [cardColor, setCardColor] = useState(card?.card_color || DEFAULT_COLOR);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [customEmojiIndex, setCustomEmojiIndex] = useState(-1);
  const [customColorIndex, setCustomColorIndex] = useState(-1);
  const [emojiGrid, setEmojiGrid] = useState([...DEFAULT_EMOJIS]);
  const [colorGrid, setColorGrid] = useState([...DEFAULT_COLORS]);

  // Load saved customizations
  useEffect(() => {
    const loadCustomizations = async () => {
      const customization = await getCardCustomization(cardId);
      setEmojiGrid(customization.emojis);
      setColorGrid(customization.colors);
    };
    loadCustomizations();
  }, [cardId]);

  const handleEmojiSelected = ({ emoji }) => {
    setEmoji(emoji);
    if (customEmojiIndex >= 0) {
      const newEmojiGrid = [...emojiGrid];
      newEmojiGrid[customEmojiIndex] = emoji;
      setEmojiGrid(newEmojiGrid);
      saveCardCustomization(cardId, newEmojiGrid, colorGrid);
    }
    setShowEmojiPicker(false);
  };

  const handleColorSelected = ({ hex }) => {
    setCustomColor(hex);
  };

  const resetToDefaults = async () => {
    await resetCardCustomization(cardId);
    setEmoji(DEFAULT_EMOJI);
    setCardColor(DEFAULT_COLOR);
    setCustomEmojiIndex(-1);
    setCustomColorIndex(-1);
    setEmojiGrid([...DEFAULT_EMOJIS]);
    setColorGrid([...DEFAULT_COLORS]);
  };

  const handleSave = () => {
    updateCard(cardId, {
      card_name: cardName,
      card_icon: emoji,
      card_color: cardColor,
    });
    navigation.goBack();
  };

  return (
    <View f={1} backgroundColor={Colors.dark.background}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack px="$4" gap="$4" pb="$8" jc="space-between" f={1}>
          <YStack gap="$4" f={1}>
            {/* Card Preview */}
            <YStack gap="$1" ai="center" pt="$3">
              <View height={5} width={60} backgroundColor={Colors.dark.backgroundTertiary} borderRadius={50} />
              {/* <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" mt="$3">
                Preview
              </Text> */}

              <View height={CARD_HEIGHT * 0.3} overflow="hidden" borderTopEndRadius={20} borderTopStartRadius={20} pt="$4" w="100%">
                <View scale={1.35} transformOrigin="top" perspectiveOrigin="top" ai="center">
                  <CardComponent
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
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily={'$heading'}>
                Card Name
              </Text>
              <Input
                value={cardName}
                onChangeText={setCardName}
                placeholder="Enter card name"
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={0}
                color={Colors.dark.text}
                placeholderTextColor={Colors.dark.textTertiary}
                fontSize="$4"
                p={0}
                px="$4"
                fontWeight="700"
              />
            </YStack>

            {/* Reset Button */}
            <Button
              backgroundColor={'transparent'}
              pressStyle={{ opacity: 0.7, backgroundColor: 'transparent', borderWidth: 0 }}
              onPress={resetToDefaults}
              size="$3"
              borderRadius={8}
              flexDirection="row"
              gap="$1"
              mb="-$2"
            >
              <ArrowPathIcon size={16} color={Colors.dark.primary} />
              <Text color={Colors.dark.primary} fontSize="$3" fontWeight="600">
                Reset to Default
              </Text>
            </Button>

            {/* Emoji Grid */}
            <YStack gap="$2" width="100%">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily={'$heading'}>
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
                    borderWidth={emoji === emojiItem ? 2 : 0}
                    borderColor={Colors.dark.primary}
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
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily={'$heading'}>
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
                    <Circle
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderWidth={cardColor === color.value ? 2 : 0}
                      borderColor={Colors.dark.background}
                    />
                    {color.name === 'custom' && <PlusIcon size={16} color={Colors.dark.text} />}
                  </Button>
                ))}
              </XStack>
            </YStack>
          </YStack>

          {/* Bottom Buttons */}
          <YStack width="100%" gap="$2.5" borderTopWidth={1} borderTopColor={`${Colors.dark.border}40`} pt="$4" mt="$4">
            <Button
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={handleSave}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily={'$archivo'}>
                Save
              </Text>
            </Button>
            <Button
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => navigation.goBack()}
              size="$5"
              borderRadius={15}
            >
              <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily={'$archivo'}>
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
              onPress={() => {
                if (customColorIndex >= 0) {
                  const newColorGrid = [...colorGrid];
                  newColorGrid[customColorIndex].value = customColor;
                  setColorGrid(newColorGrid);
                  saveCardCustomization(cardId, emojiGrid, newColorGrid);
                }
                setCardColor(customColor);
                setShowColorWheel(false);
              }}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily={'$archivo'}>
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
