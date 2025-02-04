import React from 'react';
import { useColorScheme } from 'react-native';
import { ColorSchemeContext } from '@/config/colors';

export const ColorSchemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  return <ColorSchemeContext.Provider value={colorScheme || 'light'}>{children}</ColorSchemeContext.Provider>;
};
