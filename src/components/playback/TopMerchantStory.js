import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { BuildingStorefrontIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/context/ColorSchemeContext';
import { styles } from './styles';

export function TopMerchantStory({ topMerchant, topMerchantVisits }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <BuildingStorefrontIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Most Visited Merchant</Text>
      <Text style={[styles.merchant, { color: colors.text }]}>{topMerchant || 'Unknown'}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{topMerchantVisits || 0} visits</Text>
    </YStack>
  );
}
