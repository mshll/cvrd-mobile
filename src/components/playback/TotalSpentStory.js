import React from 'react';
import { View } from 'react-native';
import { YStack, Text } from 'tamagui';

export function TotalSpentStory({ totalSpent }) {
  return (
    <YStack f={1} ai="center" jc="center">
      <Text>Total Spent Story</Text>
    </YStack>
  );
}
