import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/context/ColorSchemeContext';
import { formatCurrency } from '@/utils/utils';
import { styles } from './styles';

export function TopLocationStory({ topLocation, topLocationAmount }) {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <MapPinIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Top Location</Text>
      <Text style={[styles.location, { color: colors.text }]}>{topLocation || 'Unknown'}</Text>
      <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(topLocationAmount || 0)}</Text>
    </YStack>
  );
}
