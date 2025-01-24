import { Colors } from '@/config/colors';
import { View, Text, Input, XStack, YStack, Button } from 'tamagui';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Filter } from '@tamagui/lucide-icons';
import { StyleSheet, SectionList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

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
            hasMore: false
          }
        });
      }, 1000);
    });
  }
};

const FILTER_OPTIONS = [
  { id: 'recent', label: 'Most Recent', sortKey: 'date', sortOrder: 'desc', group: 'sort' },
  { id: 'highest', label: 'Highest Amount', sortKey: 'amount', sortOrder: 'desc', group: 'sort' },
  { id: 'lowest', label: 'Lowest Amount', sortKey: 'amount', sortOrder: 'asc', group: 'sort' },
  { id: 'settled', label: 'Settled Only', filterKey: 'status', filterValue: 'Settled', group: 'status' },
  { id: 'declined', label: 'Declined Only', filterKey: 'status', filterValue: 'Declined', group: 'status' }
];

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
    color: 'pink'
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
    color: 'blue'
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
    color: 'green'
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
    color: 'yellow'
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
    color: 'pink'
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
    color: 'blue'
  }
].concat(
  // Additional random transactions for March
  Array(4).fill(null).map((_, index) => ({
    id: String(index + 7),
    name: `Card ${index + 1}`,
    cardType: ['Category', 'Merchant', 'Burner', 'Location'][index % 4],
    amount: 12 + index,
    date: `2024-03-${5 - index}T${14 - index}:35:00`,
    displayDate: `Mar ${5 - index}, ${14 - index}:35 PM`,
    status: index % 3 === 0 ? 'Declined' : 'Settled',
    emoji: ['🎬', '🛍️', '🔥', '📍'][index % 4],
    color: ['pink', 'green', 'blue', 'yellow'][index % 4]
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
      data
    }));
};

const TransactionItem = ({ transaction }) => {
  const { name, cardType, amount, displayDate, status, emoji, color } = transaction;
  
  const getBgColor = (colorName) => {
    switch (colorName) {
      case 'pink':
        return 'rgba(225, 76, 129, 0.15)';
      case 'green':
        return 'rgba(68, 212, 125, 0.15)';
      case 'blue':
        return 'rgba(57, 129, 166, 0.15)';
      case 'yellow':
        return 'rgba(235, 225, 75, 0.15)';
      default:
        return colorName;
    }
  };

  const getTextColor = (colorName) => {
    switch (colorName) {
      case 'pink':
        return '#E14C81';
      case 'green':
        return '#44D47D';
      case 'blue':
        return '#3981A6';
      case 'yellow':
        return '#8B8534';
      default:
        return colorName;
    }
  };
  
  return (
    <XStack
      backgroundColor={Colors.dark.backgroundSecondary}
      p={16}
      mb={10}
      br={12}
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap={12} f={1}>
        <View
          width={50}
          height={50}
          br={8}
          backgroundColor={Colors.dark.backgroundTertiary}
          ai="center"
          jc="center"
        >
          <Text fontSize={20}>{emoji}</Text>
        </View>
        <YStack f={1}>
          <XStack>
            <View
              backgroundColor={getBgColor(color)}
              br={20}
              px={10}
              py={2}
              fd="row"
              ai="center"
              gap={4}
              maxWidth="80%"
            >
              <Text 
                color={getTextColor(color)} 
                fontSize={14} 
                fontWeight="500"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            </View>
          </XStack>
          <Text color={Colors.dark.textSecondary} fontSize={12} mt={4}>
            {displayDate}
          </Text>
        </YStack>
      </XStack>
      <YStack ai="flex-end" ml={8}>
        <Text
          color={Colors.dark.text}
          fontSize={16}
          fontWeight="500"
        >
          - KD {amount}
        </Text>
        <Text
          color={status === 'Declined' ? Colors.dark.primary : Colors.dark.textSecondary}
          fontSize={14}
        >
          {status}
        </Text>
      </YStack>
    </XStack>
  );
};

const SkeletonItem = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <XStack
      backgroundColor={Colors.dark.backgroundSecondary}
      p={16}
      mb={10}
      br={12}
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap={12} f={1}>
        <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
        <YStack f={1}>
          <XStack>
            <Animated.View style={[styles.skeletonBadge, { opacity: fadeAnim }]} />
          </XStack>
          <Animated.View style={[styles.skeletonDate, { opacity: fadeAnim }]} />
        </YStack>
      </XStack>
      <YStack ai="flex-end" ml={8}>
        <Animated.View style={[styles.skeletonAmount, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonStatus, { opacity: fadeAnim }]} />
      </YStack>
    </XStack>
  );
};

const LoadingSkeleton = () => {
  return (
    <View style={styles.content}>
      <View style={styles.sectionHeader} backgroundColor={Colors.dark.background}>
        <Text color={Colors.dark.textSecondary} fontSize={16} fontWeight="500">
          <Animated.View style={styles.skeletonMonth} />
        </Text>
      </View>
      
      {/* Show only 4 items which is typically what fits in the viewport */}
      {Array(5).fill(0).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};

const ActivityScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => {
      const selectedFilter = FILTER_OPTIONS.find(option => option.id === filterId);
      const isSelected = prev.includes(filterId);
      
      if (isSelected) {
        // If deselecting, just remove the filter
        return prev.filter(id => id !== filterId);
      } else {
        // If selecting, handle mutual exclusivity
        let updatedFilters = [...prev];
        
        // Remove any other filters from the same group
        if (selectedFilter.group) {
          const groupFilters = FILTER_OPTIONS
            .filter(option => option.group === selectedFilter.group)
            .map(option => option.id);
          updatedFilters = updatedFilters.filter(id => !groupFilters.includes(id));
        }
        
        // Add the new filter
        return [...updatedFilters, filterId];
      }
    });
  };

  const applyFilters = useCallback((data) => {
    let filteredData = [...data];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(transaction =>
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply selected filters
    selectedFilters.forEach(filterId => {
      const filter = FILTER_OPTIONS.find(option => option.id === filterId);
      if (!filter) return;

      if (filter.filterKey) {
        filteredData = filteredData.filter(
          transaction => transaction[filter.filterKey] === filter.filterValue
        );
      }

      if (filter.sortKey) {
        filteredData.sort((a, b) => {
          const valueA = a[filter.sortKey];
          const valueB = b[filter.sortKey];
          const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
          return filter.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
    });

    return filteredData;
  }, [searchQuery, selectedFilters]);

  const fetchTransactions = useCallback(async () => {
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
  }, [applyFilters]);

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <View f={1} bg={Colors.dark.background}>
      <YStack pt={insets.top - 30} px={16} space={16}>
        <XStack space={8}>
          <XStack
            f={1}
            br={8}
            backgroundColor={Colors.dark.backgroundSecondary}
            ai="center"
            px={12}
          >
            <Search size={20} color={Colors.dark.textSecondary} />
            <Input
              f={1}
              placeholder="Search"
              placeholderTextColor={Colors.dark.textSecondary}
              color={Colors.dark.text}
              borderWidth={0}
              backgroundColor="transparent"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                fetchTransactions();
              }}
            />
          </XStack>
          
          <Button
            backgroundColor={showFilters ? Colors.dark.primary : Colors.dark.backgroundSecondary}
            br={8}
            p={12}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={Colors.dark.text} />
          </Button>
        </XStack>

        {showFilters && (
          <XStack flexWrap="wrap" gap={8}>
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                backgroundColor={
                  selectedFilters.includes(option.id)
                    ? Colors.dark.primary
                    : Colors.dark.backgroundSecondary
                }
                br={20}
                px={12}
                py={6}
                onPress={() => {
                  toggleFilter(option.id);
                  fetchTransactions();
                }}
              >
                <Text
                  color={
                    selectedFilters.includes(option.id)
                      ? Colors.dark.text
                      : Colors.dark.textSecondary
                  }
                  fontSize={14}
                >
                  {option.label}
                </Text>
              </Button>
            ))}
          </XStack>
        )}
      </YStack>

      <View style={styles.listContainer}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Text color={Colors.dark.primary} ta="center" mt={20}>{error}</Text>
        ) : transactions.length === 0 ? (
          <Text color={Colors.dark.textSecondary} ta="center" mt={20}>No transactions found</Text>
        ) : (
          <SectionList
            sections={groupTransactionsByMonth(transactions)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionItem transaction={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader} backgroundColor={Colors.dark.background}>
                <Text color={Colors.dark.textSecondary} fontSize={16} fontWeight="500">
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
    marginBottom: 90,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 20,
  },
  skeletonIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  skeletonBadge: {
    width: 120,
    height: 26,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  skeletonDate: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    marginTop: 4,
  },
  skeletonAmount: {
    width: 80,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  skeletonStatus: {
    width: 60,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    marginTop: 4,
  },
  skeletonMonth: {
    width: 150,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
});

export default ActivityScreen;