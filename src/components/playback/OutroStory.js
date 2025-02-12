import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { ArrowTrendingUpIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/context/ColorSchemeContext';
import { styles } from './styles';

export function OutroStory() {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <ArrowTrendingUpIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>You're Trending Up!</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Here's to another year of smart spending</Text>
    </YStack>
  );
}
