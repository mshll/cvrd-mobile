import React from 'react';
import { View } from 'react-native';
import { YStack, Text } from 'tamagui';
import { CurrencyDollarIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';


import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function HighestPurchaseStory({ highestPurchase, highestPurchaseMerchant }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <CurrencyDollarIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Highest Purchase</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(highestPurchase || 0)}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{highestPurchaseMerchant || 'Unknown'}</Text>
    </YStack>
  );
}
