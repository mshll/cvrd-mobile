import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECTION_ORDER_KEY = '@cvrd/section_order';

const DEFAULT_ORDER = ['merchant', 'category', 'location', 'burner'];

export function useSectionOrder() {
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const savedOrder = await AsyncStorage.getItem(SECTION_ORDER_KEY);
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      console.error('Error loading section order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrder = async (newOrder) => {
    try {
      await AsyncStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(newOrder));
      setOrder(newOrder);
    } catch (error) {
      console.error('Error saving section order:', error);
    }
  };

  const resetOrder = async () => {
    try {
      await AsyncStorage.removeItem(SECTION_ORDER_KEY);
      setOrder(DEFAULT_ORDER);
    } catch (error) {
      console.error('Error resetting section order:', error);
    }
  };

  return {
    order,
    isLoading,
    saveOrder,
    resetOrder,
  };
}
