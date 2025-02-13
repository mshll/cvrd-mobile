import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { BanknotesIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';
import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function CardsCreatedStory({ totalCards }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <BanknotesIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Total Cards Created</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{totalCards}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>across all your cards</Text>
    </YStack>
  );
}
