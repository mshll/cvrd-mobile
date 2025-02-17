import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { useState, useCallback } from 'react';
import { History } from '@tamagui/lucide-icons';
import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionCard, { LoadingSkeleton } from '../components/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/solid';
import SearchBar from '@/components/SearchBar';
import TransactionList from '@/components/TransactionList';
import BottomSheet from '@/components/BottomSheet';

// Constants for filter options
const SORT_OPTIONS = [
  { id: 'date_asc', label: 'Oldest First' },
  { id: 'amount_desc', label: 'Highest Amount' },
  { id: 'amount_asc', label: 'Lowest Amount' },
];

const STATUS_OPTIONS = [
  { id: 'APPROVED', label: 'Approved' },
  { id: 'DECLINED', label: 'Declined' },
];

// Filter Badge Component
const FilterBadge = ({ label, isActive, onPress, onClear }) => {
  const colors = useColors();
  return (
    <Button
      backgroundColor={isActive ? colors.primary : colors.backgroundSecondary}
      pressStyle={{ backgroundColor: isActive ? colors.primaryDark : colors.backgroundTertiary }}
      onPress={onPress}
      size="$3"
      borderRadius={20}
      borderWidth={1}
      borderColor={isActive ? colors.primary : colors.border}
      pl="$3"
      pr={isActive ? '$1' : '$3'}
      height={32}
    >
      <XStack ai="center" gap="$2">
        <Text color={isActive ? 'white' : colors.text} fontSize="$3">
          {label}
        </Text>
        {isActive && (
          <Button size="$2" circular backgroundColor={colors.primaryDark} onPress={onClear} p={0} w={16} h={16}>
            <XMarkIcon size={12} color="white" />
          </Button>
        )}
      </XStack>
    </Button>
  );
};

const ActivityScreen = () => {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showStatusSheet, setShowStatusSheet] = useState(false);

  // Fetch transactions using the hook
  const { data: transactions = [], isLoading, error, refetch } = useTransactions();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleSearch = useCallback((query) => {
    setSearchText(query);
  }, []);

  const getSortLabel = () => {
    return sortOption === 'date_desc' ? 'Sort' : SORT_OPTIONS.find((option) => option.id === sortOption)?.label;
  };

  const getStatusLabel = () => {
    return statusFilter === 'all' ? 'Status' : STATUS_OPTIONS.find((option) => option.id === statusFilter)?.label;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Text color={colors.primary} ta="center" mt={20} fontFamily="$body">
        {error.message || 'Failed to load transactions'}
      </Text>
    );
  }

  return (
    <View f={1} bg={colors.background}>
      <YStack gap="$2" pt={24} pb="$2">
        {/* Title */}
        <XStack ai="center" gap="$2" px="$4">
          <History size={20} color={colors.text} />
          <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
            Activity
          </Text>
        </XStack>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} searchText={searchText} placeholder="Search transactions" />

        {/* Filter Badges */}
        <XStack px="$4" gap="$2">
          <FilterBadge
            label={getSortLabel()}
            isActive={sortOption !== 'date_desc'}
            onPress={() => setShowSortSheet(true)}
            onClear={() => setSortOption('date_desc')}
          />
          <FilterBadge
            label={getStatusLabel()}
            isActive={statusFilter !== 'all'}
            onPress={() => setShowStatusSheet(true)}
            onClear={() => setStatusFilter('all')}
          />
        </XStack>
      </YStack>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        showHeader={false}
        searchText={searchText}
        sortOption={sortOption}
        statusFilter={statusFilter}
      />

      {/* Sort Options Sheet */}
      <BottomSheet isOpen={showSortSheet} onClose={() => setShowSortSheet(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <XStack jc="space-between" ai="center">
            <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack" fontWeight="900">
              Sort By
            </Text>
            <Button
              size="$3"
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={() => setShowSortSheet(false)}
              borderRadius={8}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Done
              </Text>
            </Button>
          </XStack>
          <YStack gap="$2">
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.id}
                backgroundColor={sortOption === option.id ? colors.primary : colors.backgroundSecondary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={() => {
                  setSortOption(option.id);
                  setShowSortSheet(false);
                }}
                size="$5"
                borderRadius={12}
              >
                <Text color={sortOption === option.id ? 'white' : colors.text} fontSize="$4" fontWeight="600">
                  {option.label}
                </Text>
              </Button>
            ))}
          </YStack>
        </YStack>
      </BottomSheet>

      {/* Status Filter Sheet */}
      <BottomSheet isOpen={showStatusSheet} onClose={() => setShowStatusSheet(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <XStack jc="space-between" ai="center">
            <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
              Filter by Status
            </Text>
            <Button
              size="$3"
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={() => setShowStatusSheet(false)}
              borderRadius={8}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Done
              </Text>
            </Button>
          </XStack>
          <YStack gap="$2">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                backgroundColor={statusFilter === option.id ? colors.primary : colors.backgroundSecondary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={() => {
                  setStatusFilter(option.id);
                  setShowStatusSheet(false);
                }}
                size="$5"
                borderRadius={12}
              >
                <Text color={statusFilter === option.id ? 'white' : colors.text} fontSize="$4" fontWeight="600">
                  {option.label}
                </Text>
              </Button>
            ))}
          </YStack>
        </YStack>
      </BottomSheet>
    </View>
  );
};

export default ActivityScreen;
