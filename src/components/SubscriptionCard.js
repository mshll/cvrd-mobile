import { View, Text, Image, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { getCardAssets, getCardTheme, getLuminance, CARD_ASPECT_RATIO } from '@/utils/cardUtils';
import { CalendarIcon } from 'react-native-heroicons/outline';
import { PauseIcon, PlayIcon } from 'react-native-heroicons/solid';
import { useState } from 'react';
import { BlurView } from 'expo-blur';

const SubscriptionCard = ({ subscription }) => {
  const { theme: appTheme } = useColors();
  const { merchantName, amount, nextBillingDate, logo, backgroundColor } = subscription;
  const [isPaused, setIsPaused] = useState(false);

  // Get the appropriate theme based on background color
  const cardTheme = getCardTheme(backgroundColor);
  const textColor = cardTheme === 'dark' ? '#000000' : '#FFFFFF';

  // Calculate the scale needed to fill the width while maintaining aspect ratio
  const cardWidth = 300;
  const cardHeight = 180;
  const scale = cardWidth / (cardHeight * CARD_ASPECT_RATIO);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <View
      width={cardWidth}
      height={cardHeight}
      borderRadius={20}
      overflow="hidden"
      backgroundColor={backgroundColor}
      marginRight={16}
    >
      {/* Dimming Overlay */}
      {isPaused && (
        <BlurView
          intensity={10}
          tint="dark"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'dark',
              zIndex: 1,
            },
          ]}
        />
      )}

      {/* Background Pattern */}
      <View position="absolute" width="100%" height="100%" ai="center" jc="center" overflow="hidden">
        <Image
          source={require('@/../assets/netflix-pattern.png')}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: 1,
              transform: [{ scale: scale * 1.5 }],
              width: '100%',
              height: '100%',
            },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View flex={1} padding={20} justifyContent="space-between" zIndex={1}>
        {/* Top Section with Logo and Pause Button */}
        <XStack jc="space-between" ai="center">
          <Image
            source={logo}
            style={{
              width: 120,
              height: 50,
              resizeMode: 'contain',
              tintColor: textColor,
              opacity: isPaused ? 0.7 : 1,
            }}
          />
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 10,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: `${textColor}40`,
              zIndex: 2,
            }}
          >
            <BlurView intensity={10} tint={cardTheme === 'dark' ? 'dark' : 'light'}>
              <TouchableOpacity
                onPress={handleTogglePause}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                {isPaused ? <PlayIcon size={20} color={textColor} /> : <PauseIcon size={20} color={textColor} />}
              </TouchableOpacity>
            </BlurView>
          </View>
        </XStack>

        {/* Bottom Section */}
        <View gap={4}>
          <Text
            color={textColor}
            fontSize={24}
            fontWeight="700"
            fontFamily={'$archivoBlack'}
            opacity={isPaused ? 0.7 : 1}
          >
            {amount}
          </Text>
          <View flexDirection="row" alignItems="center" gap={4}>
            <CalendarIcon size={16} color={`${textColor}CC`} opacity={isPaused ? 0.7 : 1} />
            <Text color={`${textColor}CC`} fontSize={14} fontWeight={'500'} opacity={isPaused ? 0.7 : 1}>
              Next billing date: {nextBillingDate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionCard;
