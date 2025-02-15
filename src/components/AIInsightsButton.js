import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, XStack } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';
import { SparklesIcon } from 'react-native-heroicons/solid';

export function AIInsightsButton({ onPress }) {
  const colors = useColors();

  return (
    <TouchableOpacity onPress={onPress}>
      <XStack
        bg={colors.card}
        p="$4"
        mx="$4"
        mb="$4"
        br={16}
        ai="center"
        jc="space-between"
        borderWidth={1}
        borderColor={colors.border}
      >
        <XStack ai="center" gap="$2">
          <SparklesIcon size={24} color={colors.primary} />
          <Text color={colors.text} fontSize="$4" fontWeight="600">
            AI Spending Insights
          </Text>
        </XStack>
        <Text color={colors.textSecondary} fontSize="$3">
          View Analysis →
        </Text>
      </XStack>
    </TouchableOpacity>
  );
}
