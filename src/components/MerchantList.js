import { View, Text, YStack, XStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet } from 'react-native';
import { BuildingStorefrontIcon } from 'react-native-heroicons/solid';
import MerchantCard from './MerchantCard';

// Dummy merchant data
const MERCHANTS = [
  {
    id: '1',
    name: 'Netflix',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    url: 'https://netflix.com',
    description: 'Stream your favorite movies and TV shows anytime, anywhere.',
  },
  {
    id: '2',
    name: 'Netflix',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    url: 'https://netflix.com',
    description: 'Stream your favorite movies and TV shows anytime, anywhere.',
  },
  {
    id: '3',
    name: 'Netflix',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    url: 'https://netflix.com',
    description: 'Stream your favorite movies and TV shows anytime, anywhere.',
  },
];

const MerchantList = () => {
  const colors = useColors();

  return (
    <YStack gap="$4">
      {/* Section Header */}
      <XStack ai="center" gap="$2" px="$4">
        <BuildingStorefrontIcon size={20} color={colors.text} />
        <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
          Available Merchants
        </Text>
      </XStack>

      {/* Merchant Cards */}
      <YStack px="$4">
        {MERCHANTS.map((merchant) => (
          <MerchantCard key={merchant.id} merchant={merchant} />
        ))}
      </YStack>
    </YStack>
  );
};

export default MerchantList;
