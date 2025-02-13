import { View, Text, YStack } from 'tamagui';
import { useMemo } from 'react';
import { StyleSheet, SectionList, RefreshControl } from 'react-native';
import TransactionCard from './TransactionCard';
import { useColors } from '@/context/ColorSchemeContext';
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid';

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
  onRefresh,
  refreshing = false,
  searchText = '',
  sortOption = 'date_desc',
  statusFilter = 'all',
  containerStyle,
  sectionBackground,
  cardBackgroundColor,
}) => {
  const colors = useColors();
  const sectionBg = sectionBackground || colors.background;
  const cardBg = cardBackgroundColor || colors.backgroundSecondary;

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
                {searchText ? `No Results for "${searchText}"` : 'No Transactions Found'}
              </Text>
              <Text color={colors.textSecondary} fontSize="$3" textAlign="center">
                {searchText
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
