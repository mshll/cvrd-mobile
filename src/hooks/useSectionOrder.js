import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const STORAGE_KEY = '@section_order';
const DEFAULT_ORDER = ['BURNER', 'MERCHANT', 'CATEGORY', 'LOCATION'];

export function useSectionOrder() {
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const savedOrder = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
      console.log('📱 Loaded section order:', savedOrder ? JSON.parse(savedOrder) : DEFAULT_ORDER);
    } catch (error) {
      console.error('❌ Error loading section order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrder = async (newOrder) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      setOrder(newOrder);
      console.log('💾 Saved new section order:', newOrder);
    } catch (error) {
      console.error('❌ Error saving section order:', error);
    }
  };

  const resetOrder = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setOrder(DEFAULT_ORDER);
      console.log('🔄 Reset section order to default:', DEFAULT_ORDER);
    } catch (error) {
      console.error('❌ Error resetting section order:', error);
    }
  };

  return {
    order,
    isLoading,
    saveOrder,
    resetOrder,
  };
}
