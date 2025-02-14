import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Button, Text, YStack } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';

export function SpendingRecapButton({ onPress }) {
  const colors = useColors();

  return (
    <Button
      size="$5"
      bg={colors.backgroundSecondary}
      pressStyle={{ opacity: 0.9 }}
      onPress={onPress}
      marginHorizontal={16}
      marginBottom={18}
      br={12}
      p={0}
      borderWidth={1}
      borderColor={colors.border}
      overflow="hidden"
      height={90}
    >
      <ImageBackground
        source={require('@/../assets/patterns/pattern2.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundPattern}
      >
        <YStack p="$4" gap="$1" f={1} jc="space-between">
          <YStack gap="$1">
            <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack" textAlign="left">
              2025 CVR
            </Text>
            <Text color={colors.textSecondary} fontSize="$4" fontFamily="$archivoMedium" textAlign="left">
              Review your yearly spending
            </Text>
          </YStack>
        </YStack>
      </ImageBackground>
    </Button>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundPattern: {
    opacity: 0.5,
    width: '100%',
    resizeMode: 'cover',
    height: '100%',
  },
});
