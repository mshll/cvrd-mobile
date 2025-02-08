import { View, Text, YStack, XStack, Button, Input } from 'tamagui';
import { useColors } from '@/config/colors';
import { Search, ArrowDown, ArrowUp } from '@tamagui/lucide-icons';

const TransactionFilters = ({
  searchQuery,
  setSearchQuery,
  dateSort,
  setDateSort,
  amountSort,
  setAmountSort,
  statusFilter,
  setStatusFilter,
}) => {
  const colors = useColors();

  const toggleDateSort = () => {
    setDateSort((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setAmountSort(null);
  };

  const toggleAmountSort = () => {
    setAmountSort((prev) => {
      if (!prev || prev === 'asc') return 'desc';
      return 'asc';
    });
  };

  const toggleStatusFilter = () => {
    setStatusFilter((prev) => {
      if (prev === 'all' || prev === 'Declined') return 'Settled';
      return 'Declined';
    });
  };

  return (
    <YStack gap="$2">
      {/* Search and Sort */}
      <XStack space={8} mb="$2">
        <XStack
          f={1}
          br={8}
          backgroundColor={colors.card}
          ai="center"
          px={12}
          borderWidth={1}
          borderColor={colors.border}
        >
          <Search size={20} color={colors.textSecondary} />
          <Input
            f={1}
            placeholder="Search"
            placeholderTextColor={colors.textSecondary}
            color={colors.text}
            borderWidth={0}
            backgroundColor="transparent"
            value={searchQuery}
            onChangeText={setSearchQuery}
            fontFamily="$body"
          />
        </XStack>

        <Button
          backgroundColor={colors.card}
          br={8}
          p={12}
          onPress={toggleDateSort}
          borderWidth={1}
          borderColor={colors.border}
        >
          {dateSort === 'desc' ? (
            <ArrowDown size={20} color={colors.text} />
          ) : (
            <ArrowUp size={20} color={colors.text} />
          )}
        </Button>
      </XStack>

      {/* Filter Buttons */}
      <XStack gap={8} mb="$2">
        <Button
          f={1}
          backgroundColor={statusFilter === 'all' && !amountSort ? colors.primary : colors.card}
          br={10}
          px={12}
          py={6}
          borderWidth={1}
          borderColor={colors.border}
          onPress={() => {
            setStatusFilter('all');
            setAmountSort(null);
          }}
        >
          <Text
            color={statusFilter === 'all' && !amountSort ? colors.text : colors.textSecondary}
            fontSize={14}
            fontFamily="$body"
            fontWeight="600"
          >
            All
          </Text>
        </Button>

        <Button
          f={1}
          backgroundColor={amountSort ? colors.primary : colors.card}
          br={10}
          px={12}
          py={6}
          borderWidth={1}
          borderColor={colors.border}
          onPress={toggleAmountSort}
        >
          <Text color={amountSort ? colors.text : colors.textSecondary} fontSize={14}>
            {!amountSort ? 'Amount' : amountSort === 'desc' ? 'Lowest' : 'Highest'}
          </Text>
        </Button>

        <Button
          f={1}
          backgroundColor={statusFilter !== 'all' ? colors.primary : colors.card}
          br={10}
          px={12}
          py={6}
          borderWidth={1}
          borderColor={colors.border}
          onPress={toggleStatusFilter}
        >
          <Text color={statusFilter !== 'all' ? colors.text : colors.textSecondary} fontSize={14}>
            {statusFilter === 'all' ? 'Status' : statusFilter === 'Settled' ? 'Declined' : 'Settled'}
          </Text>
        </Button>
      </XStack>
    </YStack>
  );
};

export default TransactionFilters;
