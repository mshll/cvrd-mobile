import { Colors, useColors } from '@/config/colors';
import { View, Text, Input, XStack, YStack, Button } from 'tamagui';
import { useState, useCallback, useEffect } from 'react';
import { Search, ArrowDown, ArrowUp, History } from '@tamagui/lucide-icons';
import { StyleSheet, SectionList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionCard, { LoadingSkeleton } from '../components/TransactionCard';
import { DUMMY_TRANSACTIONS } from '../data/transactions';
import TransactionFilters from '@/components/TransactionFilters';

// This would typically come from an API client file
const API = {
  fetchTransactions: async ({ page = 1, filters = {} } = {}) => {
    // Simulate API call with dummy data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: DUMMY_TRANSACTIONS,
          meta: {
            total: DUMMY_TRANSACTIONS.length,
            page: 1,
            hasMore: false,
          },
        });
      }, 1000);
    });
  },
};

const SORT_STATES = {
  DATE: 'date',
  AMOUNT: 'amount',
};

const FILTER_STATES = {
  ALL: 'all',
  SETTLED: 'Settled',
  DECLINED: 'Declined',
};

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
  const [statusFilter, setStatusFilter] = useState(FILTER_STATES.ALL);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyFilters = useCallback(
    (data) => {
      let filteredData = [...data];

      // Apply search filter
      if (searchQuery) {
        filteredData = filteredData.filter((transaction) =>
          transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== FILTER_STATES.ALL) {
        filteredData = filteredData.filter((transaction) => transaction.status === statusFilter);
      }

      // Apply sorting
      if (amountSort) {
        filteredData.sort((a, b) => {
          const comparison = a.amount - b.amount;
          return amountSort === 'desc' ? -comparison : comparison;
        });
      } else {
        // Default to date sorting if amount sort is not active
        filteredData.sort((a, b) => {
          const comparison = new Date(a.date) - new Date(b.date);
          return dateSort === 'desc' ? -comparison : comparison;
        });
      }

      return filteredData;
    },
    [searchQuery, dateSort, amountSort, statusFilter]
  );

  // Fetch transactions whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await API.fetchTransactions();
        const filteredData = applyFilters(response.data);
        setTransactions(filteredData);
      } catch (err) {
        setError('Failed to load transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [applyFilters]);

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
      if (prev === FILTER_STATES.ALL || prev === FILTER_STATES.DECLINED) return FILTER_STATES.SETTLED;
      return FILTER_STATES.DECLINED;
    });
  }, []);

  return (
    <View f={1} bg={colors.background}>
      {/* Header Section */}
      <YStack pt={insets.top - 20} px={16} space={16} backgroundColor={colors.background}>
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
            {error}
          </Text>
        ) : transactions.length === 0 ? (
          <Text color={colors.textSecondary} ta="center" mt={20} fontFamily="$body">
            No transactions found
          </Text>
        ) : (
          <SectionList
            sections={groupTransactionsByMonth(transactions)}
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
