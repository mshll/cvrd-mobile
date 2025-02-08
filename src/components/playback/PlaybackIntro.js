import React from 'react';
import { Text } from 'react-native';
import { YStack } from 'tamagui';
import { SparklesIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';

export function PlaybackIntro() {
  const colors = useColors();
  return (
    <YStack f={1} ai="center" jc="center" gap="$4">
      <SparklesIcon size={64} color={colors.primary} />
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          textAlign: 'center',
          fontFamily: '$archivoBlack',
          color: colors.text,
        }}
      >
        Your 2024 in Cards
      </Text>
      <Text
        style={{ fontSize: 16, textAlign: 'center', fontFamily: '$body', opacity: 0.8, color: colors.textSecondary }}
      >
        Let's look back at your spending journey
      </Text>
    </YStack>
  );
}
