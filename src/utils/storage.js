import { Colors } from '@/config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CARD_CUSTOMIZATION_KEY = 'card_customizations';

// Default values
export const DEFAULT_EMOJIS = ['💳', '💰', '🏦', '🛍️', '🎫', '✈️', '🛒', '🎮', '🍽️', '🏭', '💻'];
export const DEFAULT_COLORS = [
  { name: 'pink', value: '#E14C81' },
  { name: 'green', value: '#77f5bc' },
  { name: 'blue', value: '#3981A6' },
  { name: 'yellow', value: '#EBE14B' },
  { name: 'purple', value: '#9747FF' },
  { name: 'orange', value: '#FF7847' },
  { name: 'teal', value: '#47D5FF' },
  { name: 'red', value: '#FF4747' },
  { name: 'indigo', value: '#4762FF' },
  { name: 'lime', value: '#B1FF47' },
  { name: 'cyan', value: '#47FFF4' },
  { name: 'custom', value: Colors.dark.backgroundTertiary },
];

export const getCardCustomization = async (cardId) => {
  try {
    const customizations = await AsyncStorage.getItem(CARD_CUSTOMIZATION_KEY);
    if (customizations) {
      const parsed = JSON.parse(customizations);
      return parsed[cardId] || { emojis: [...DEFAULT_EMOJIS], colors: [...DEFAULT_COLORS] };
    }
    return { emojis: [...DEFAULT_EMOJIS], colors: [...DEFAULT_COLORS] };
  } catch (error) {
    console.error('Error getting card customization:', error);
    return { emojis: [...DEFAULT_EMOJIS], colors: [...DEFAULT_COLORS] };
  }
};

export const saveCardCustomization = async (cardId, emojis, colors) => {
  try {
    const customizations = await AsyncStorage.getItem(CARD_CUSTOMIZATION_KEY);
    const parsed = customizations ? JSON.parse(customizations) : {};

    parsed[cardId] = { emojis, colors };
    await AsyncStorage.setItem(CARD_CUSTOMIZATION_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Error saving card customization:', error);
  }
};

export const resetCardCustomization = async (cardId) => {
  try {
    const customizations = await AsyncStorage.getItem(CARD_CUSTOMIZATION_KEY);
    if (customizations) {
      const parsed = JSON.parse(customizations);
      // Instead of just deleting, set it to default values
      parsed[cardId] = { emojis: [...DEFAULT_EMOJIS], colors: [...DEFAULT_COLORS] };
      await AsyncStorage.setItem(CARD_CUSTOMIZATION_KEY, JSON.stringify(parsed));
    }
  } catch (error) {
    console.error('Error resetting card customization:', error);
  }
};

export const DEFAULT_EMOJI = '💳';
export const DEFAULT_COLOR = '#3981A6'; // blue
