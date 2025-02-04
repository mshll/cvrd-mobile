import { Colors, useColors } from '@/config/colors';
import { View, Text, Input, XStack, YStack, Button } from 'tamagui';
import { useState, useCallback, useEffect } from 'react';
import { Search, ArrowDown, ArrowUp, History } from '@tamagui/lucide-icons';
import { StyleSheet, SectionList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionCard, { LoadingSkeleton } from '../components/TransactionCard';

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

// Update the dummy data to include different months
const DUMMY_TRANSACTIONS = [
  // March Transactions
  {
    id: '1',
    name: 'Entertainment',
    cardType: 'Category',
    amount: 20,
    date: '2024-03-10T14:35:00',
    displayDate: 'Mar 10, 02:35 PM',
    status: 'Settled',
    emoji: '🎬',
    color: 'pink',
  },
  {
    id: '2',
    name: 'Streaming',
    cardType: 'Merchant',
    amount: 15,
    date: '2024-03-08T14:34:00',
    displayDate: 'Mar 08, 02:34 PM',
    status: 'Declined',
    emoji: '📺',
    color: 'blue',
  },
  // February Transactions
  {
    id: '3',
    name: 'Shopping',
    cardType: 'Category',
    amount: 150,
    date: '2024-02-28T11:20:00',
    displayDate: 'Feb 28, 11:20 AM',
    status: 'Settled',
    emoji: '🛍️',
    color: 'green',
  },
  {
    id: '4',
    name: 'Coffee Shop',
    cardType: 'Location',
    amount: 8,
    date: '2024-02-15T09:45:00',
    displayDate: 'Feb 15, 09:45 AM',
    status: 'Settled',
    emoji: '☕',
    color: 'yellow',
  },
  // January Transactions
  {
    id: '5',
    name: 'Travel Card',
    cardType: 'Burner',
    amount: 500,
    date: '2024-01-20T16:30:00',
    displayDate: 'Jan 20, 04:30 PM',
    status: 'Settled',
    emoji: '✈️',
    color: 'pink',
  },
  {
    id: '6',
    name: 'Restaurant',
    cardType: 'Location',
    amount: 45,
    date: '2024-01-15T20:15:00',
    displayDate: 'Jan 15, 08:15 PM',
    status: 'Declined',
    emoji: '🍽️',
    color: 'blue',
  },
].concat(
  // Additional random transactions for March
  Array(4)
    .fill(null)
    .map((_, index) => ({
      id: String(index + 7),
      name: `Card ${index + 1}`,
      cardType: ['Category', 'Merchant', 'Burner', 'Location'][index % 4],
      amount: 12 + index,
      date: `2024-03-${5 - index}T${14 - index}:35:00`,
      displayDate: `Mar ${5 - index}, ${14 - index}:35 PM`,
      status: index % 3 === 0 ? 'Declined' : 'Settled',
      emoji: ['🎬', '🛍️', '🔥', '📍'][index % 4],
      color: ['pink', 'green', 'blue', 'yellow'][index % 4],
    }))
);

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

        <XStack space={8}>
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

        <XStack gap={8}>
          <Button
            f={1}
            backgroundColor={statusFilter === FILTER_STATES.ALL && !amountSort ? colors.primary : colors.card}
            br={10}
            px={12}
            py={6}
            borderWidth={1}
            borderColor={colors.border}
            onPress={() => {
              setStatusFilter(FILTER_STATES.ALL);
              setAmountSort(null);
            }}
          >
            <Text
              color={statusFilter === FILTER_STATES.ALL && !amountSort ? colors.text : colors.textSecondary}
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
            backgroundColor={statusFilter !== FILTER_STATES.ALL ? colors.primary : colors.card}
            br={10}
            px={12}
            py={6}
            borderWidth={1}
            borderColor={colors.border}
            onPress={toggleStatusFilter}
          >
            <Text color={statusFilter !== FILTER_STATES.ALL ? colors.text : colors.textSecondary} fontSize={14}>
              {statusFilter === FILTER_STATES.ALL
                ? 'Status'
                : statusFilter === FILTER_STATES.SETTLED
                ? 'Declined'
                : 'Settled'}
            </Text>
          </Button>
        </XStack>
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
