import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { BanknotesIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/context/ColorSchemeContext';
import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function TotalSpentStory({ totalSpent }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <BanknotesIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Total Spent</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(totalSpent || 0)}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>across all your cards</Text>
    </YStack>
  );
}
