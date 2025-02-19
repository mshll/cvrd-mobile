import { View, Text, ScrollView, YStack, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { StyleSheet } from 'react-native';
import { BuildingStorefrontIcon } from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MerchantCard from '@/components/MerchantCard';
import { MERCHANTS } from '@/data/merchants';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const AllMerchantsScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { subscriptions } = useSubscriptions();

  // Create a Set of subscribed merchant names for O(1) lookup
  const subscribedMerchants = new Set(subscriptions.map((sub) => sub.merchant));

  return (
    <View f={1} bg={colors.background} pt={20}>
      <ScrollView contentContainerStyle={styles.container}>
        <YStack gap="$4">
          {/* Header */}
          <XStack ai="center" gap="$2" px="$4" mb="$2">
            <BuildingStorefrontIcon size={20} color={colors.text} />
            <Text color={colors.text} fontSize="$4" fontFamily="Archivo-Black" fontWeight="900">
              All Merchants
            </Text>
          </XStack>

          {/* Merchant Cards */}
          <YStack px="$4">
            {MERCHANTS.map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                isSubscribed={subscribedMerchants.has(merchant.name)}
              />
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
