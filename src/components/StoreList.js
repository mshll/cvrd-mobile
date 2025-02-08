import { View, Text, YStack, XStack, Button } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet } from 'react-native';
import { TagIcon } from 'react-native-heroicons/solid';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import StoreCard from './StoreCard';
import { STORES } from '@/data/stores';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

const StoreList = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const displayedStores = STORES.slice(0, 3);

  const handleViewMore = () => {
    navigation.navigate(Paths.ALL_STORES);
  };

  return (
    <YStack gap="$4">
      {/* Section Header */}
      <XStack ai="center" jc="space-between" px="$4">
        <XStack ai="center" gap="$2">
          <TagIcon size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
            Discount Codes
          </Text>
        </XStack>
        <Text color={colors.textSecondary} fontSize={14}>
          {STORES.length} stores
        </Text>
      </XStack>

      {/* Store Cards */}
      <YStack px="$4">
        {displayedStores.map((store) => (
          <StoreCard key={store.id} store={store} />
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
            View All Stores
          </Text>
          <ChevronRightIcon size={20} color={colors.text} />
        </Button>
      </YStack>
    </YStack>
  );
};

export default StoreList;
