import { Colors } from '@/context/ColorSchemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  CARD_CUSTOMIZATION: 'cvrd:card_customizations',
  HIDE_PAUSE_WARNING: 'cvrd:hide_pause_warning1',
};

const DEFAULT_CUSTOMIZATION = {
  emojis: ['💳', '💰', '🏦', '🛍️', '🎫', '✈️', '🛒', '🎮', '🍽️', '🏭', '💻'],
  colors: [
    { name: 'red', value: '#d6515b' },
    { name: 'green', value: '#77f5bc' },
    { name: 'blue', value: '#3981A6' },
    { name: 'yellow', value: '#EBE14B' },
    { name: 'purple', value: '#9747FF' },
    { name: 'orange', value: '#FF7847' },
    { name: 'teal', value: '#47D5FF' },
    { name: 'pink', value: '#E14C81' },
    { name: 'indigo', value: '#4762FF' },
    { name: 'lime', value: '#B1FF47' },
    { name: 'cyan', value: '#47FFF4' },
    { name: 'custom', value: '' },
  ],
};

// Create a deep clone of the default customization
const cloneDefaults = () => ({
  emojis: [...DEFAULT_CUSTOMIZATION.emojis],
  colors: DEFAULT_CUSTOMIZATION.colors.map((color) => ({ ...color })),
});

export const Defaults = {
  ...DEFAULT_CUSTOMIZATION,
  EMOJI: '💳',
  COLOR: '#3981A6',
};

const getStoredCustomizations = async () => {
  try {
    const data = await AsyncStorage.getItem(StorageKeys.CARD_CUSTOMIZATION);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const getCardCustomization = async (cardId) => {
  if (!cardId) return cloneDefaults();
  const customizations = await getStoredCustomizations();
  return customizations[cardId] || cloneDefaults();
};

export const saveCardCustomization = async (cardId, emojis, colors) => {
  if (!cardId) return;
  try {
    const customizations = await getStoredCustomizations();
    customizations[cardId] = {
      emojis: Array.isArray(emojis) ? [...emojis] : [...DEFAULT_CUSTOMIZATION.emojis],
      colors: Array.isArray(colors)
        ? colors.map((color) => ({ ...color }))
        : DEFAULT_CUSTOMIZATION.colors.map((color) => ({ ...color })),
    };
    await AsyncStorage.setItem(StorageKeys.CARD_CUSTOMIZATION, JSON.stringify(customizations));
  } catch (error) {
    console.error('Failed to save card customization:', error);
  }
};

export const resetCardCustomization = async (cardId) => {
  if (!cardId) return cloneDefaults();
  try {
    const customizations = await getStoredCustomizations();
    const defaultCustomization = cloneDefaults();
    customizations[cardId] = defaultCustomization;
    await AsyncStorage.setItem(StorageKeys.CARD_CUSTOMIZATION, JSON.stringify(customizations));
    return defaultCustomization;
  } catch {
    return cloneDefaults();
  }
};

export const { EMOJI: DEFAULT_EMOJI, COLOR: DEFAULT_COLOR } = Defaults;

// Pause warning preference
export const getHidePauseWarning = async () => {
  try {
    const value = await AsyncStorage.getItem(StorageKeys.HIDE_PAUSE_WARNING);
    return value === 'true';
  } catch {
    return false;
  }
};

export const setHidePauseWarning = async (hide) => {
  try {
    await AsyncStorage.setItem(StorageKeys.HIDE_PAUSE_WARNING, hide.toString());
  } catch (error) {
    console.error('Failed to save pause warning preference:', error);
  }
};
