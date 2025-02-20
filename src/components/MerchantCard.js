import { View, Text, Button, XStack, YStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { ArrowUpRightIcon, CheckIcon } from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import { getCardTheme } from '@/utils/cardUtils';
import { useState, useEffect } from 'react';

const TARGET_HEIGHT = 32; // Fixed height for all logos
const MAX_WIDTH = 120; // Maximum width allowed

const styles = StyleSheet.create({
  logoContainer: {
    height: TARGET_HEIGHT,
    maxWidth: MAX_WIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

const MerchantCard = ({ merchant, isSubscribed }) => {
  const colors = useColors();
  const { name, logo, url, description, minAmount } = merchant;
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
        {/* Logo and Link Button */}
        <XStack justifyContent="space-between" alignItems="center">
          <View style={[styles.logoContainer, { width: logoWidth }]}>
            <Image
              source={logo}
              style={{
                width: logoWidth,
                height: TARGET_HEIGHT,
                resizeMode: 'contain',
                tintColor: logoColor,
              }}
            />
          </View>
          <Button
            backgroundColor={isSubscribed ? Colors.cards.blue + '20' : colors.backgroundTertiary}
            borderRadius={8}
            size="$3"
            icon={
              isSubscribed ? (
                <CheckIcon size={16} color={Colors.cards.blue} />
              ) : (
                <ArrowUpRightIcon size={16} color={colors.text} />
              )
            }
            onPress={handlePress}
            pressStyle={{ backgroundColor: isSubscribed ? Colors.cards.blue + '30' : colors.backgroundTertiary }}
          >
            <Text color={isSubscribed ? Colors.cards.blue : colors.text} fontSize={14} fontWeight="600">
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Text>
          </Button>
        </XStack>

        {/* Description */}
        <Text color={colors.textSecondary} fontSize={14}>
          {description}
        </Text>

        <Text color={colors.primary} fontSize={14} fontWeight="700">
          Starting from {minAmount}
        </Text>
      </View>
    </View>
  );
};

export default MerchantCard;
