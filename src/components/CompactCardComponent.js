import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { CheckCircleIcon, PauseCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { BuildingStorefrontIcon, FireIcon, MapPinIcon, TagIcon } from 'react-native-heroicons/outline';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

// Helper function to get card type icon and color
const getCardTypeInfo = (type) => {
  const cleanType = type?.replace('_LOCKED', '');
  switch (cleanType) {
    case 'LOCATION':
      return { Icon: MapPinIcon, color: Colors.cards.blue };
    case 'BURNER':
      return { Icon: FireIcon, color: Colors.cards.red };
    case 'MERCHANT':
      return { Icon: BuildingStorefrontIcon, color: Colors.cards.green };
    case 'CATEGORY':
      return { Icon: TagIcon, color: Colors.cards.purple };
    default:
      return { Icon: FireIcon, color: Colors.cards.red };
  }
};

function Badge({ icon: Icon, text, color, backgroundColor }) {
  return (
    <XStack
      backgroundColor={backgroundColor || `${color}15`}
      paddingHorizontal={8}
      paddingVertical={4}
      borderRadius={8}
      alignItems="center"
      gap={4}
      borderWidth={1}
      borderColor={`${color}30`}
    >
      <Icon size={12} color={color} />
      <Text color={color} fontSize={11} fontWeight="600">
        {text}
      </Text>
    </XStack>
  );
}

function CompactCardComponent({ item }) {
  const colors = useColors();
  const navigation = useNavigation();
  const { Icon: TypeIcon, color: typeColor } = getCardTypeInfo(item.type);

  const handlePress = () => {
    navigation.navigate(Paths.CARD_DETAILS, {
      cardId: item.id,
    });
  };

  // Get status badge info
  const getStatusBadge = () => {
    if (item.isClosed) {
      return {
        Icon: XCircleIcon,
        text: 'Closed',
        color: Colors.cards.pink,
      };
    }
    if (item.isPaused) {
      return {
        Icon: PauseCircleIcon,
        text: 'Paused',
        color: Colors.cards.yellow,
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <XStack
        backgroundColor={colors.backgroundSecondary}
        borderWidth={1}
        borderColor={colors.border}
        height={80}
        borderRadius={16}
        overflow="hidden"
        alignItems="center"
        gap={16}
        p={16}
      >
        {/* Left section with icon in squircle */}
        <View
          width={48}
          height={48}
          backgroundColor={`${item.backgroundColor}15`}
          alignItems="center"
          justifyContent="center"
          borderRadius={14}
          borderWidth={1}
          borderColor={`${item.backgroundColor}30`}
        >
          <Text fontSize={24}>{item.emoji}</Text>
        </View>

        {/* Middle section with name and card number */}
        <YStack flex={1} gap={4}>
          <Text color={colors.text} fontSize={16} fontWeight="600" numberOfLines={1}>
            {item.label}
          </Text>

          <Text color={colors.textSecondary} fontSize={13} fontFamily="$mono">
            •••• {item.lastFourDigits}
          </Text>
        </YStack>

        {/* Right section with badges */}
        <YStack alignItems="flex-end" gap={6}>
          <Badge icon={TypeIcon} text={item.type.replace('_LOCKED', '').toLowerCase()} color={typeColor} />
          {statusBadge && <Badge icon={statusBadge.Icon} text={statusBadge.text} color={statusBadge.color} />}
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
}

export default CompactCardComponent;
