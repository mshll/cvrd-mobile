import { View, Text, XStack, YStack, Button } from 'tamagui';
import { useState, useCallback, useMemo } from 'react';
import { History, ListFilter } from '@tamagui/lucide-icons';
import { StyleSheet, SectionList, RefreshControl } from 'react-native';
import TransactionCard from './TransactionCard';
import { useColors } from '@/config/colors';
import { MagnifyingGlassIcon, ArrowDownIcon, ArrowUpIcon } from 'react-native-heroicons/solid';
import SearchBar from './SearchBar';

export const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Latest First', icon: ArrowDownIcon },
  { id: 'date_asc', label: 'Oldest First', icon: ArrowUpIcon },
  { id: 'amount_desc', label: 'Highest Amount', icon: ArrowDownIcon },
  { id: 'amount_asc', label: 'Lowest Amount', icon: ArrowUpIcon },
];

export const STATUS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'DECLINED', label: 'Declined' },
];

const FilterButton = ({ label, isActive, onPress, icon: Icon }) => {
  const colors = useColors();
  return (
    <Button
      backgroundColor={isActive ? colors.primary : colors.backgroundSecondary}
      pressStyle={{ backgroundColor: isActive ? colors.primaryDark : colors.backgroundTertiary }}
      onPress={onPress}
      size="$3"
      icon={Icon ? <Icon size={16} color={isActive ? 'white' : colors.text} /> : undefined}
      borderRadius={8}
      borderWidth={1}
      borderColor={isActive ? colors.primary : colors.border}
    >
      <Text color={isActive ? 'white' : colors.text} fontSize="$3">
        {label}
      </Text>
    </Button>
  );
};

// Helper function to group transactions by month
const groupTransactionsByMonth = (transactions) => {
  const groups = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(transaction);
    return acc;
  }, {});

  return Object.entries(groups)
    .sort(([monthA], [monthB]) => {
      const dateA = new Date(monthA);
      const dateB = new Date(monthB);
      return dateB - dateA;
    })
    .map(([month, data]) => ({
      title: month,
      data,
    }));
};

const TransactionList = ({
  transactions = [],
  isLoading = false,
  onRefresh,
  refreshing = false,
  showHeader = true,
  containerStyle,
  sectionBackground,
  cardBackgroundColor,
}) => {
  const colors = useColors();
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const sectionBg = sectionBackground || colors.background;
  const cardBg = cardBackgroundColor || colors.backgroundSecondary;

  const handleSearch = useCallback((query) => {
    setSearchText(query);
  }, []);

  // Apply filters and sorting
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.merchant?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const amountDiff = a.amount - b.amount;

      switch (sortOption) {
        case 'date_asc':
          return dateA - dateB;
        case 'date_desc':
          return dateB - dateA;
        case 'amount_asc':
          return amountDiff;
        case 'amount_desc':
          return -amountDiff;
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [transactions, searchText, sortOption, statusFilter]);

  const sections = groupTransactionsByMonth(filteredTransactions);

  return (
    <YStack f={1} style={containerStyle}>
      {showHeader && (
        <YStack px={16} gap={16} backgroundColor={colors.background}>
          <XStack ai="center" jc="space-between">
            <XStack ai="center" gap="$2">
              <History size={20} color={colors.text} />
              <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
                Activity
              </Text>
            </XStack>

            <XStack gap="$2">
              <Button
                size="$4"
                backgroundColor={showSearch ? colors.primary : colors.backgroundSecondary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={() => {
                  if (showSearch) {
                    handleSearch('');
                    setSearchText('');
                  }
                  setShowSearch(!showSearch);
                  if (showFilters) {
                    setShowFilters(false);
                  }
                }}
                borderRadius={8}
                borderWidth={1}
                borderColor={showSearch ? colors.primary : colors.border}
                p="$3"
              >
                <MagnifyingGlassIcon size={18} color={showSearch ? 'white' : colors.text} />
              </Button>

              <Button
                size="$4"
                backgroundColor={showFilters ? colors.primary : colors.backgroundSecondary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={() => {
                  setShowFilters(!showFilters);
                  if (showSearch) {
                    setShowSearch(false);
                    handleSearch('');
                    setSearchText('');
                  }
                }}
                borderRadius={8}
                borderWidth={1}
                borderColor={showFilters ? colors.primary : colors.border}
                p="$3"
              >
                <ListFilter size={18} color={showFilters ? 'white' : colors.text} />
              </Button>
            </XStack>
          </XStack>

          {/* Filter Section */}
          {showFilters && (
            <YStack gap="$4" py="$2">
              {/* Status Filters */}
              <YStack gap="$2">
                <XStack jc="space-between" ai="center">
                  <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                    Status
                  </Text>
                  <Button
                    size="$2"
                    bg="transparent"
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => {
                      setSortOption('date_desc');
                      setStatusFilter('all');
                    }}
                  >
                    <Text color={colors.primary} fontSize="$2">
                      Reset
                    </Text>
                  </Button>
                </XStack>
                <XStack gap="$2" flexWrap="wrap">
                  {STATUS_OPTIONS.map((option) => (
                    <FilterButton
                      key={option.id}
                      label={option.label}
                      isActive={statusFilter === option.id}
                      onPress={() => setStatusFilter(option.id)}
                    />
                  ))}
                </XStack>
              </YStack>

              {/* Sort Options */}
              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Sort By
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {SORT_OPTIONS.map((option) => (
                    <FilterButton
                      key={option.id}
                      label={option.label}
                      isActive={sortOption === option.id}
                      onPress={() => setSortOption(option.id)}
                      icon={option.icon}
                    />
                  ))}
                </XStack>
              </YStack>
            </YStack>
          )}
        </YStack>
      )}

      {/* Search Bar */}
      {showSearch && <SearchBar onSearch={handleSearch} searchText={searchText} placeholder="Search transactions" />}

      {/* Transactions List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} backgroundColor={cardBg} />}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader} backgroundColor={sectionBg}>
            <Text color={colors.textSecondary} fontSize={16} fontFamily="$heading" fontWeight="600">
              {title}
            </Text>
          </View>
        )}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={[styles.content, sections.length === 0 && { flexGrow: 1 }]}
        ListEmptyComponent={
          <YStack f={1} ai="center" jc="center" gap="$4" px="$4" pt="$10">
            <MagnifyingGlassIcon size={40} color={colors.primary} />
            <YStack ai="center" gap="$2">
              <Text color={colors.text} fontSize="$5" fontWeight="600" textAlign="center">
                {showSearch && searchText ? `No Results for "${searchText}"` : 'No Transactions Found'}
              </Text>
              <Text color={colors.textSecondary} fontSize="$3" textAlign="center">
                {showSearch && searchText
                  ? 'Try searching for a different transaction or merchant.'
                  : statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No transactions to show'}
              </Text>
            </YStack>
          </YStack>
        }
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text}
              colors={[colors.primary]}
              progressBackgroundColor={colors.backgroundSecondary}
            />
          ) : undefined
        }
      />
    </YStack>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingBottom: 12,
    marginBottom: 8,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    minHeight: '100%',
  },
});

export default TransactionList;
