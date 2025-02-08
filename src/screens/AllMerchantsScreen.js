import { View, Text, ScrollView, YStack, XStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet } from 'react-native';
import { BuildingStorefrontIcon } from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MerchantCard from '@/components/MerchantCard';
import { MERCHANTS } from '@/data/merchants';

const AllMerchantsScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View f={1} bg={colors.background} pt={insets.top - 20}>
      <ScrollView contentContainerStyle={styles.container}>
        <YStack gap="$4">
          {/* Header */}
          <XStack ai="center" gap="$2" px="$4" mb="$2">
            <BuildingStorefrontIcon size={20} color={colors.text} />
            <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
              All Merchants
            </Text>
          </XStack>

          {/* Merchant Cards */}
          <YStack px="$4">
            {MERCHANTS.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default AllMerchantsScreen;
