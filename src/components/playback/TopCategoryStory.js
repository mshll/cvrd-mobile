import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { TagIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/context/ColorSchemeContext';
import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function TopCategoryStory({ topCategory, topCategoryAmount }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <TagIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Top Category</Text>
      <Text style={[styles.category, { color: colors.text }]}>{topCategory || 'Unknown'}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(topCategoryAmount || 0)}</Text>
    </YStack>
  );
}
