import { FlatList, View } from 'react-native';
import { YStack, Text } from 'tamagui';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';
import { useColors } from '@/config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SearchView({
  searchResults,
  searchText,
  listRef,
  renderItem,
  emptyMessage = 'Try searching for something else.',
  searchTerm = 'item', // e.g., 'card', 'transaction', etc.
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const EmptyResults = () => {
    // If there's no search text, show empty view
    if (!searchText?.trim()) {
      return <View style={{ flex: 1 }} />;
    }

    // Show no results view when there's a search but no results
    return (
      <YStack f={1} ai="center" jc="center" gap="$4" px="$4" pt="$10">
        <MagnifyingGlassIcon size={40} color={`${colors.primary}`} />
        <YStack ai="center" gap="$2">
          <Text color={colors.text} fontSize="$6" fontWeight="600" textAlign="center">
            No Results for "{searchText}"
          </Text>
          <Text color={colors.textSecondary} fontSize="$2" textAlign="center">
            {emptyMessage}
          </Text>
        </YStack>
      </YStack>
    );
  };

  return (
    <FlatList
      ref={listRef}
      data={searchResults}
      renderItem={renderItem}
      keyExtractor={(item) => item.id?.toString()}
      ListEmptyComponent={EmptyResults}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingTop: 20,
        paddingBottom: insets.bottom,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

export default SearchView;
