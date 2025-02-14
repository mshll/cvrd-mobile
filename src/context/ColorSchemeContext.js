import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

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
  const colorScheme = useColorScheme();
  return Colors[colorScheme || 'light'];
}

export function ColorSchemeProvider({ children }) {
  const colorScheme = useColorScheme();

  return <ColorSchemeContext.Provider value={colorScheme}>{children}</ColorSchemeContext.Provider>;
}

export function useColorSchemeContext() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useColorSchemeContext must be used within a ColorSchemeProvider');
  }
  return context;
}
