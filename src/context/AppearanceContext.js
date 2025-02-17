import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppearanceContext = createContext(null);

const STORAGE_KEY = 'cvrd:appearance_mode';

export const AppearanceProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
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
        console.log('Failed to load appearance mode:', error);
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
      console.log('Failed to save appearance mode:', error);
    }
  };

  // Calculate effective color scheme based on appearance mode
  const effectiveColorScheme = appearanceMode === 'system' ? systemColorScheme : appearanceMode;

  return (
    <AppearanceContext.Provider
      value={{
        appearanceMode,
        updateAppearanceMode,
        effectiveColorScheme,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};
