import { Colors, useColors } from '@/config/colors';
import { View, Text, Input, XStack, YStack, Button, Spinner } from 'tamagui';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, ArrowDown, ArrowUp, History } from '@tamagui/lucide-icons';
import { StyleSheet, SectionList, Dimensions, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionCard, { LoadingSkeleton } from '../components/TransactionCard';
import TransactionFilters from '@/components/TransactionFilters';
import { useTransactions } from '@/hooks/useTransactions';

// Update the grouping function to return data in SectionList format
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

  // Convert to SectionList format and sort
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

const ActivityScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [amountSort, setAmountSort] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch transactions using the hook
  const { data: transactions = [], isLoading, error, refetch } = useTransactions();

  // Apply filters and sorting
  const filteredTransactions = useMemo(() => {
    let filtered = [...(transactions || [])];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((transaction) => transaction.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter);
    }

    // Apply sorting
    if (amountSort) {
      filtered.sort((a, b) => {
        const comparison = a.amount - b.amount;
        return amountSort === 'desc' ? -comparison : comparison;
      });
    } else {
      // Default to date sorting if amount sort is not active
      filtered.sort((a, b) => {
        const comparison = new Date(a.date) - new Date(b.date);
        return dateSort === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [transactions, searchQuery, dateSort, amountSort, statusFilter]);

  const toggleDateSort = useCallback(() => {
    setDateSort((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setAmountSort(null);
  }, []);

  const toggleAmountSort = useCallback(() => {
    setAmountSort((prev) => {
      if (!prev || prev === 'asc') return 'desc';
      return 'asc';
    });
  }, []);

  const toggleStatusFilter = useCallback(() => {
    setStatusFilter((prev) => {
      if (prev === 'all' || prev === 'Declined') return 'Settled';
      return 'Declined';
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    if (refetch) {
      refetch().finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <View f={1} bg={colors.background}>
      {/* Header Section */}
      <YStack pt={20} px={16} gap={16} backgroundColor={colors.background}>
        <XStack ai="center" gap="$2">
          <History size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
            Activity
          </Text>
        </XStack>

        <TransactionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateSort={dateSort}
          setDateSort={setDateSort}
          amountSort={amountSort}
          setAmountSort={setAmountSort}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </YStack>

      {/* Transactions List */}
      <View style={[styles.listContainer]}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Text color={colors.primary} ta="center" mt={20} fontFamily="$body">
            {error.message || 'Failed to load transactions'}
          </Text>
        ) : filteredTransactions.length === 0 ? (
          <YStack f={1} ai="center" jc="center" gap="$4" px="$4">
            <History size={40} color={`${colors.primary}`} />
            <YStack ai="center" gap="$2">
              <Text color={colors.text} fontSize="$5" fontWeight="600" textAlign="center">
                No Transactions Found
              </Text>
              <Text color={colors.textSecondary} fontSize="$3" textAlign="center">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your transaction history will appear here'}
              </Text>
            </YStack>
          </YStack>
        ) : (
          <SectionList
            sections={groupTransactionsByMonth(filteredTransactions)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader} backgroundColor={colors.background}>
                <Text color={colors.textSecondary} fontSize={16} fontFamily="$archivoBlack">
                  {title}
                </Text>
              </View>
            )}
            stickySectionHeadersEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 20,
  },
});

export default ActivityScreen;
