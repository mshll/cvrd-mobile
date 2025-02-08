import { View, Text, Button, XStack, YStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { ArrowUpRightIcon, ClipboardIcon } from 'react-native-heroicons/outline';
import { getCardTheme } from '@/utils/cardUtils';
import * as Clipboard from 'expo-clipboard';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const TARGET_HEIGHT = 32;
const MAX_WIDTH = 120;

const styles = StyleSheet.create({
  logoContainer: {
    height: TARGET_HEIGHT,
    maxWidth: MAX_WIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    height: TARGET_HEIGHT,
    resizeMode: 'contain',
  },
});

const StoreCard = ({ store }) => {
  const colors = useColors();
  const { name, logo, url, description, discountCode, discountAmount, validUntil } = store;
  const [logoWidth, setLogoWidth] = useState(MAX_WIDTH);

  // Get theme for the card background
  const theme = getCardTheme(colors.backgroundSecondary);
  const logoColor = theme === 'dark' ? '#000000' : '#FFFFFF';

  useEffect(() => {
    // Get the image dimensions when the component mounts
    const { width, height } = Image.resolveAssetSource(logo);
    // Calculate width while maintaining aspect ratio for target height
    const scaledWidth = (TARGET_HEIGHT / height) * width;
    // Ensure width doesn't exceed maximum
    setLogoWidth(Math.min(scaledWidth, MAX_WIDTH));
  }, [logo]);

  const handlePress = async () => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(discountCode);
    Toast.show({
      type: 'success',
      text1: 'Code Copied',
      text2: `${discountCode} has been copied to clipboard`,
    });
  };

  return (
    <View
      backgroundColor={colors.backgroundSecondary}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.border}
      overflow="hidden"
      marginBottom={12}
    >
      <View padding={16} gap={12}>
        {/* Logo and Buttons */}
        <XStack justifyContent="space-between" alignItems="center">
          <View style={[styles.logoContainer, { width: logoWidth }]}>
            <Image
              source={logo}
              style={[
                styles.logo,
                {
                  width: logoWidth,
                  tintColor: logoColor,
                },
              ]}
            />
          </View>
          <XStack gap={8} ai="center">
            <Button
              size="$3"
              bg={colors.card}
              pressStyle={{ bg: colors.backgroundTertiary }}
              onPress={handleCopyCode}
              br={8}
              borderWidth={1}
              borderColor={colors.border}
            >
              <XStack gap={8} ai="center">
                <ClipboardIcon size={16} color={colors.text} />
                <Text color={colors.text} fontWeight="600">
                  {discountCode}
                </Text>
              </XStack>
            </Button>
            <Button
              size="$3"
              bg={colors.card}
              pressStyle={{ bg: colors.backgroundTertiary }}
              onPress={handlePress}
              br={8}
              borderWidth={1}
              borderColor={colors.border}
              icon={<ArrowUpRightIcon size={16} color={colors.text} />}
            />
          </XStack>
        </XStack>

        {/* Description */}
        <Text color={colors.textSecondary} fontSize={14}>
          {description}
        </Text>

        <Text color={colors.primary} fontSize={14} fontWeight="700">
          {discountAmount}
        </Text>
      </View>
    </View>
  );
};

export default StoreCard;
