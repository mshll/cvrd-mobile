import { Colors, useColors } from '@/config/colors';
import { View, Text, XStack, YStack, Button } from 'tamagui';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { History, ListFilter } from '@tamagui/lucide-icons';
import { StyleSheet, SectionList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionCard, { LoadingSkeleton } from '../components/TransactionCard';
import { useTransactions } from '@/hooks/useTransactions';
import { useNavigation } from '@react-navigation/native';
import { MagnifyingGlassIcon, ArrowDownIcon, ArrowUpIcon } from 'react-native-heroicons/solid';
import SearchBar from '@/components/SearchBar';
import TransactionList from '@/components/TransactionList';

const ActivityScreen = () => {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

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
      <TransactionList
        transactions={transactions}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        showHeader={true}
      />
    </View>
  );
};

export default ActivityScreen;
