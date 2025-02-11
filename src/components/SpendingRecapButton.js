import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, XStack } from 'tamagui';
import { SparklesIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';

export function SpendingRecapButton({ onPress }) {
  const colors = useColors();

  return (
    <Button
      size="$4"
      bg={colors.card}
      pressStyle={{ bg: colors.backgroundTertiary }}
      onPress={onPress}
      marginHorizontal={16}
      marginBottom={16}
      icon={<SparklesIcon size={20} color={colors.primary} />}
      br={12}
      borderWidth={1}
      borderColor={colors.border}
    >
      <XStack gap="$2" ai="center">
        <Text color={colors.text} fontSize="$4" fontWeight="700">
          Your 2024 Recap
        </Text>
      </XStack>
    </Button>
  );
}
