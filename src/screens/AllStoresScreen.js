import { View, Text, ScrollView, YStack, XStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet } from 'react-native';
import { TagIcon } from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StoreCard from '@/components/StoreCard';
import { STORES } from '@/data/stores';

const AllStoresScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View f={1} bg={colors.background} pt={insets.top - 20}>
      <ScrollView contentContainerStyle={styles.container}>
        <YStack gap="$4">
          {/* Header */}
          <XStack ai="center" gap="$2" px="$4" mb="$2">
            <TagIcon size={20} color={colors.text} />
            <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
              All Stores
            </Text>
          </XStack>

          {/* Store Cards */}
          <YStack px="$4">
            {STORES.map((store) => (
              <StoreCard key={store.id} store={store} />
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

export default AllStoresScreen;
