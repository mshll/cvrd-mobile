import React from 'react';
import { View } from 'react-native';
import { YStack, Text } from 'tamagui';
import { BanknotesIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/context/ColorSchemeContext';
import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function TotalSpentStory({ totalSpent }) {
  return (
    <YStack f={1} ai="center" jc="center">
      <Text>Total Spent Story</Text>
    </YStack>
  );
}
