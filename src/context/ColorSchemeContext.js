import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cvrd:appearance_mode';

export const Colors = {
  dark: {
    primary: '#d6515b',
    primaryDark: '#b9444d',
    background: '#06070c',
    backgroundSecondary: '#12171F',
    backgroundTertiary: '#1f222d',
    card: '#12171F',
    text: '#f5f5f5',
    textSecondary: '#999999',
    textTertiary: '#666666',
    border: '#262d3d',
    borderSecondary: '#333d51',
    danger: '#F4405E',
    success: '#00c851',
    warning: '#ffbb33',
    info: '#33b5e5',
  },
  light: {
    primary: '#c93b46',
    primaryLight: '#e66a74',
    background: '#f0f0f0',
    backgroundSecondary: '#e3e3e3',
    backgroundTertiary: '#d6d6d6',
    card: '#f5f5f5',
    text: '#212121',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#cccccc',
    borderSecondary: '#b3b3b3',
    danger: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12',
    info: '#3498db',
  },
  cards: {
    red: '#d6515b',
    green: '#7bd497',
    blue: '#3981A6',
    yellow: '#EBE14B',
    purple: '#9747FF',
    orange: '#FF7847',
    pink: '#d986c2',
    teal: '#47D5FF',
    indigo: '#4762FF',
    lime: '#B1FF47',
    cyan: '#47FFF4',
    brown: '#A65C39',
    gray: '#808080',
    navy: '#232F3E',
  },
};

const ColorSchemeContext = createContext(null);

export function useColors() {
  const { effectiveColorScheme } = useAppTheme();
  return Colors[effectiveColorScheme || 'light'];
}

export function ColorSchemeProvider({ children }) {
  const systemColorScheme = useNativeColorScheme();
  const [appearanceMode, setAppearanceMode] = useState('system'); // 'system', 'light', or 'dark'

  // Load saved appearance mode on mount
  useEffect(() => {
    const loadAppearanceMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMode) {
          setAppearanceMode(savedMode);
        }
      } catch (error) {
        console.error('Failed to load appearance mode:', error);
      }
    };
    loadAppearanceMode();
  }, []);

  // Save appearance mode when it changes
  const updateAppearanceMode = async (mode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
      setAppearanceMode(mode);
    } catch (error) {
      console.error('Failed to save appearance mode:', error);
    }
  };

  // Calculate effective color scheme based on appearance mode
  const effectiveColorScheme = appearanceMode === 'system' ? systemColorScheme : appearanceMode;

  return (
    <ColorSchemeContext.Provider
      value={{
        appearanceMode,
        updateAppearanceMode,
        effectiveColorScheme,
        colorScheme: effectiveColorScheme, // for backward compatibility
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ColorSchemeProvider');
  }
  return context;
}
