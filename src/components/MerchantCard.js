import { View, Text, Image, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ArrowUpRightIcon } from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import { getCardTheme } from '@/utils/cardUtils';

const MerchantCard = ({ merchant }) => {
  const colors = useColors();
  const { name, logo, url, description } = merchant;

  // Get theme for the card background
  const theme = getCardTheme(colors.backgroundSecondary);
  const logoColor = theme === 'dark' ? '#000000' : '#FFFFFF';

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
          <Image
            source={logo}
            style={{
              width: 100,
              height: 30,
              resizeMode: 'contain',
              tintColor: logoColor,
            }}
          />
          <Button
            backgroundColor={colors.backgroundTertiary}
            borderRadius={8}
            size="$3"
            icon={<ArrowUpRightIcon size={16} color={colors.text} />}
            onPress={handlePress}
            pressStyle={{ backgroundColor: colors.backgroundTertiary }}
            borderWidth={1}
            borderColor={colors.border}
          >
            <Text color={colors.text} fontSize={14} fontWeight="600">
              Subscribe
            </Text>
          </Button>
        </XStack>

        {/* Description */}
        <Text color={colors.textSecondary} fontSize={14}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default MerchantCard;
