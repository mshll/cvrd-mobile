import { View, Text, YStack, XStack, Button } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet } from 'react-native';
import { BuildingStorefrontIcon } from 'react-native-heroicons/solid';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import MerchantCard from './MerchantCard';
import { MERCHANTS } from '@/data/merchants';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

const MerchantList = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const displayedMerchants = MERCHANTS.slice(0, 3);

  const handleViewMore = () => {
    navigation.navigate(Paths.ALL_MERCHANTS);
  };

  return (
    <YStack gap="$4">
      {/* Section Header */}
      <XStack ai="center" jc="space-between" px="$4">
        <XStack ai="center" gap="$2">
          <BuildingStorefrontIcon size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
            Available Merchants
          </Text>
        </XStack>
        <Text color={colors.textSecondary} fontSize={14}>
          {MERCHANTS.length} merchants
        </Text>
      </XStack>

      {/* Merchant Cards */}
      <YStack px="$4">
        {displayedMerchants.map((merchant) => (
          <MerchantCard key={merchant.id} merchant={merchant} />
        ))}

        {/* View More Button */}
        <Button
          f={1}
          size="$5"
          bg={colors.card}
          pressStyle={{ bg: colors.backgroundTertiary }}
          onPress={handleViewMore}
          br={12}
          borderWidth={1}
          borderColor={colors.border}
          mt="$2"
        >
          <Text color={colors.text} fontWeight="700">
            View All Merchants
          </Text>
          <ChevronRightIcon size={20} color={colors.text} />
        </Button>
      </YStack>
    </YStack>
  );
};

export default MerchantList;
