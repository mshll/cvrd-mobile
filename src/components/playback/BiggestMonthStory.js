import React from 'react';
import { View } from 'react-native';
import { YStack, Text } from 'tamagui';
import { ChartBarIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';
import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function BiggestMonthStory({ biggestMonth, biggestMonthAmount }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <ChartBarIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Biggest Month</Text>
      <Text style={[styles.month, { color: colors.text }]}>{biggestMonth || 'December'}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(biggestMonthAmount || 0)}</Text>
    </YStack>
  );
}
