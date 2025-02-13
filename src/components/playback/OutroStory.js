import React from 'react';
import { View } from 'react-native';
import { YStack, Text } from 'tamagui';
import { SparklesIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';
import { styles } from './styles';

export function OutroStory() {
  const colors = useColors();

  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <SparklesIcon size={64} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Thanks for watching!</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>See you next year!</Text>
    </YStack>
  );
}
