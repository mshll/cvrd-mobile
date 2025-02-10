import { View, ScrollView, YStack, Text, Separator, XStack, Button, Input, Spinner } from 'tamagui';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors, useColors } from '@/config/colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardComponent from '@/components/CardComponent';
import { useCards } from '@/hooks/useCards';
import { useCardMutations } from '@/hooks/useCardMutations';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  Edit3,
  Pause,
  PauseCircle,
  Play,
  Share2,
  Trash2,
  BanknotesIcon,
  Search,
  ArrowDown,
  ArrowUp,
  History,
} from '@tamagui/lucide-icons';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';
import CardFlipComponent from '@/components/CardFlipComponent';
import {
  PaintBrushIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  ShareIcon,
  TrashIcon,
  ChevronDownIcon,
} from 'react-native-heroicons/solid';
import { CARD_WIDTH_LARGE, CARD_HEIGHT_LARGE } from '@/utils/cardUtils';
import { formatCurrency } from '@/utils/utils';
import { Paths } from '@/navigation/paths';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/outline';
import { useActionSheet } from '@expo/react-native-action-sheet';
import SpendLimitMenu from '@/components/SpendLimitMenu';
import Toast from 'react-native-toast-message';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionCard from '@/components/TransactionCard';
import GBottomSheet, { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import TransactionFilters from '@/components/TransactionFilters';
import Accordion from '@/components/Accordion';
import BottomSheet from '@/components/BottomSheet';

const MAP_HEIGHT = 200;

// Helper function to get active spending limit
function getActiveSpendingLimit(card) {
  if (!card) return null;

  const limits = [
    { type: 'per_transaction', value: card.per_transaction, label: 'Per Transaction', spent: 0 },
    { type: 'per_day', value: card.per_day, label: 'Per Day', spent: card.dailySpent },
    { type: 'per_week', value: card.per_week, label: 'Per Week', spent: card.weeklySpent },
    { type: 'per_month', value: card.per_month, label: 'Per Month', spent: card.monthlySpent },
    { type: 'per_year', value: card.per_year, label: 'Per Year', spent: card.yearlySpent },
    { type: 'total', value: card.total, label: 'Total', spent: card.totalSpent },
  ];

  // Find the first non-zero limit
  const activeLimit = limits.find((limit) => limit.value > 0);
  return activeLimit || null;
}

const DURATION_OPTIONS = [
  { name: 'Per Transaction', value: 'per_transaction' },
  { name: 'Per Day', value: 'daily' },
  { name: 'Per Week', value: 'weekly' },
  { name: 'Per Month', value: 'monthly' },
  { name: 'Per Year', value: 'yearly' },
  { name: 'Total', value: 'total' },
];

const ActionButton = ({ onPress, children, disabled }) => {
  const colors = useColors();
  return (
    <Button
      width={60}
      height={60}
      borderRadius={12}
      backgroundColor={colors.backgroundSecondary}
      pressStyle={{ backgroundColor: colors.backgroundTertiary }}
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderColor={colors.border}
      opacity={disabled ? 0.5 : 1}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

const EditButton = ({ onPress, disabled }) => {
  const colors = useColors();
  return (
    <Button
      size="$2"
      px="$3"
      backgroundColor={colors.backgroundSecondary}
      pressStyle={{ backgroundColor: colors.backgroundTertiary }}
      onPress={onPress}
      borderWidth={1}
      borderColor={colors.border}
      borderRadius={8}
      opacity={disabled ? 0.5 : 1}
      disabled={disabled}
    >
      <Text color={colors.text} fontSize="$2" fontWeight="600">
        Edit
      </Text>
    </Button>
  );
};

const LocationMap = ({ latitude, longitude, radius, color, onEdit }) => {
  const colors = useColors();
  const region = {
    latitude,
    longitude,
    latitudeDelta: (radius * 2) / 69,
    longitudeDelta: (radius * 2) / 69,
  };

  return (
    <View
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ height: MAP_HEIGHT, borderRadius: 12, overflow: 'hidden' }}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          scrollEnabled={false}
          rotateEnabled={false}
          userLocationAnnotationTitle=""
          mapType="mutedStandard"
        >
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
            pinColor={color}
          />
          <MapCircle
            center={{
              latitude,
              longitude,
            }}
            radius={radius * 1609.34}
            strokeWidth={1}
            strokeColor={color}
            fillColor={`${color}40`}
          />
        </MapView>
      </View>
      {onEdit && (
        <View position="absolute" top={12} right={12}>
          <EditButton onPress={onEdit} />
        </View>
      )}
    </View>
  );
};

const SpendLimitSheet = ({ isOpen, onClose, card, onSave }) => {
  if (!card) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aboveAll={false}>
      <SpendLimitMenu
        card={card}
        onSave={(updates) => {
          onSave(updates);
          onClose();
        }}
        darkButtons
        showSaveButton
      />
    </BottomSheet>
  );
};

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

const CardDetailsScreen = () => {
  const colors = useColors();
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params || {};
  const { getCardById, isLoading: isCardsLoading } = useCards();
  const { updateCardLimitMutation, togglePauseMutation, closeCardMutation } = useCardMutations();
  const [showSpendLimitSheet, setShowSpendLimitSheet] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '50%', '90%'], []);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [amountSort, setAmountSort] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Get card data
  const card = useMemo(() => {
    const foundCard = cardId ? getCardById(cardId) : null;
    return foundCard;
  }, [cardId, getCardById]);

  // Get active spending limit
  const activeSpendingLimit = useMemo(() => getActiveSpendingLimit(card), [card]);

  // Get transactions for this card
  const { data: cardTransactions = [], isLoading: isTransactionsLoading } = useTransactions(cardId);

  // Get filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...cardTransactions];

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
  }, [cardTransactions, searchQuery, dateSort, amountSort, statusFilter]);

  // Update sections with filtered transactions
  const sections = useMemo(() => {
    return groupTransactionsByMonth(filteredTransactions);
  }, [filteredTransactions]);

  const renderSectionHeader = useCallback(
    ({ section: { title } }) => {
      return (
        <View style={styles.sectionHeader} backgroundColor={colors.backgroundSecondary}>
          <Text color={colors.textSecondary} fontSize={16} fontFamily="$archivoBlack">
            {title}
          </Text>
        </View>
      );
    },
    [colors]
  );

  const renderItem = useCallback(({ item }) => {
    return <TransactionCard transaction={item} />;
  }, []);

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

  // Show loading state while fetching card data
  if (isCardsLoading) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Spinner size="large" color={colors.text} />
      </View>
    );
  }

  // Show error state if card not found
  if (!card) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background} p="$4">
        <Text color={colors.text} fontSize="$5" textAlign="center" mb="$4">
          Card not found
        </Text>
        <Button
          onPress={() => navigation.goBack()}
          backgroundColor={colors.primary}
          pressStyle={{ backgroundColor: colors.primaryDark }}
        >
          <Text color="white">Go Back</Text>
        </Button>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate(Paths.EDIT_CARD, { cardId });
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const handleTogglePause = () => {
    if (card && !card.closed) {
      togglePauseMutation.mutate(cardId);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Cannot Toggle Pause',
        text2: 'This card is closed and cannot be modified',
      });
    }
  };

  const handleDelete = () => {
    if (card && !card.closed) {
      setShowConfirmClose(true);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Cannot Close Card',
        text2: 'This card is already closed',
      });
    }
  };

  const handleConfirmClose = () => {
    closeCardMutation.mutate(cardId, {
      onSuccess: () => {
        setShowConfirmClose(false);
        navigation.goBack();
      },
    });
  };

  const handleSpendLimitSave = (updates) => {
    if (!cardId) return;

    // Get the first limit update (we only allow one limit at a time)
    const [limitType, amount] = Object.entries(updates)[0];

    updateCardLimitMutation.mutate({
      cardId,
      limitType,
      amount,
    });
  };

  const handleEditLocation = useCallback(() => {
    navigation.navigate(Paths.EDIT_LOCATION, { cardId });
  }, [navigation, cardId]);

  return (
    <View f={1} bg={colors.background}>
      <ScrollView f={1} bg={colors.background}>
        <YStack f={1} ai="center" pt="$5" pb={150}>
          <CardFlipComponent cardId={cardId} />

          {/* Action Buttons */}
          <XStack gap="$5" mt="$5" mb="$5">
            <YStack gap="$2" ai="center" jc="center">
              <ActionButton onPress={handleTogglePause} disabled={card.closed}>
                {card.paused ? <PlayIcon size={25} color={colors.text} /> : <PauseIcon size={25} color={colors.text} />}
              </ActionButton>
            </YStack>
            <YStack gap="$2" ai="center" jc="center">
              <ActionButton onPress={handleEdit} disabled={card.closed}>
                <PaintBrushIcon size={25} color={colors.text} />
              </ActionButton>
            </YStack>
            <YStack gap="$2" ai="center" jc="center">
              <ActionButton onPress={handleShare} disabled={card.closed}>
                <ArrowUpOnSquareIcon size={25} color={colors.text} />
              </ActionButton>
            </YStack>
            <YStack gap="$2" ai="center" jc="center">
              <ActionButton onPress={handleDelete} disabled={card.closed}>
                <TrashIcon size={25} color={colors.danger} />
              </ActionButton>
            </YStack>
          </XStack>

          {/* Card Details */}
          <YStack width="100%" px="$4" gap="$4">
            {/* Spending Limit Section */}
            {activeSpendingLimit ? (
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: colors.backgroundSecondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <YStack p="$4" gap="$3">
                  <XStack jc="space-between" ai="center">
                    <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                      Spend Limit
                    </Text>
                    <EditButton onPress={() => setShowSpendLimitSheet(true)} disabled={card.closed} />
                  </XStack>
                  <YStack gap="$2">
                    {activeSpendingLimit.type === 'per_transaction' ? (
                      <Text color={colors.text} fontSize="$6" fontWeight="700">
                        {formatCurrency(activeSpendingLimit.value)}
                      </Text>
                    ) : (
                      <>
                        <XStack jc="space-between" ai="flex-end">
                          <Text color={colors.text} fontSize="$6" fontWeight="700">
                            {formatCurrency(activeSpendingLimit.spent)}
                          </Text>
                          <Text color={colors.textSecondary} fontSize="$4" fontWeight="600">
                            {formatCurrency(activeSpendingLimit.value)}
                          </Text>
                        </XStack>
                        <View
                          height={4}
                          width="100%"
                          backgroundColor={`${colors.primary}20`}
                          borderRadius={2}
                          overflow="hidden"
                        >
                          <View
                            height="100%"
                            width={`${Math.min((activeSpendingLimit.spent / activeSpendingLimit.value) * 100, 100)}%`}
                            backgroundColor={colors.primary}
                          />
                        </View>
                        <XStack jc="space-between" ai="center">
                          <Text color={colors.textSecondary} fontSize="$3">
                            {activeSpendingLimit.label}
                          </Text>
                          <Text color={colors.textSecondary} fontSize="$3">
                            {Math.round((activeSpendingLimit.spent / activeSpendingLimit.value) * 100)}%
                          </Text>
                        </XStack>
                      </>
                    )}
                    {activeSpendingLimit.type === 'per_transaction' && (
                      <Text color={colors.textSecondary} fontSize="$3">
                        {activeSpendingLimit.label}
                      </Text>
                    )}
                  </YStack>
                </YStack>
              </View>
            ) : (
              !card.closed && (
                <Button
                  onPress={() => setShowSpendLimitSheet(true)}
                  height={120}
                  borderRadius={12}
                  borderWidth={1}
                  borderStyle="dashed"
                  borderColor={colors.border}
                  backgroundColor={'transparent'}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <YStack alignItems="center" gap="$2">
                    <Text color={colors.textTertiary} fontSize="$3" fontWeight="600">
                      Set a spend limit
                    </Text>
                  </YStack>
                </Button>
              )
            )}

            {/* Location Map (only for location cards) */}
            {card.cardType === 'LOCATION_LOCKED' && card.longitude && card.latitude && (
              <View
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: colors.backgroundSecondary,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <YStack p="$4" gap="$3">
                  <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                    Location
                  </Text>
                  <LocationMap
                    latitude={card.latitude}
                    longitude={card.longitude}
                    radius={card.radius}
                    color={Colors.cards[card.cardColor] || card.cardColor}
                    onEdit={handleEditLocation}
                  />
                </YStack>
              </View>
            )}

            {/* Card Details Accordion */}
            <Accordion title="Card Details" defaultOpen={false}>
              <YStack gap="$3">
                <XStack jc="space-between">
                  <Text color={colors.textSecondary}>Total Spent</Text>
                  <Text color={colors.text}>{formatCurrency(card.totalSpent || 0)}</Text>
                </XStack>
                <Separator backgroundColor={colors.border} />

                <XStack jc="space-between">
                  <Text color={colors.textSecondary}>Card Number</Text>
                  <Text color={colors.text}>•••• {card.cardNumber?.slice(-4) || '••••'}</Text>
                </XStack>
                <Separator backgroundColor={colors.border} />

                <XStack jc="space-between">
                  <Text color={colors.textSecondary}>Expiry Date</Text>
                  <Text color={colors.text}>
                    {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : '-'}
                  </Text>
                </XStack>
                <Separator backgroundColor={colors.border} />

                <XStack jc="space-between">
                  <Text color={colors.textSecondary}>Created</Text>
                  <Text color={colors.text}>
                    {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '-'}
                  </Text>
                </XStack>
                <Separator backgroundColor={colors.border} />

                {card.merchantName && (
                  <>
                    <XStack jc="space-between">
                      <Text color={colors.textSecondary}>Merchant</Text>
                      <Text color={colors.text}>{card.merchantName}</Text>
                    </XStack>
                    <Separator backgroundColor={colors.border} />
                  </>
                )}

                {card.categoryName && (
                  <>
                    <XStack jc="space-between">
                      <Text color={colors.textSecondary}>Category</Text>
                      <Text color={colors.text}>{card.categoryName}</Text>
                    </XStack>
                    <Separator backgroundColor={colors.border} />
                  </>
                )}

                <XStack jc="space-between">
                  <Text color={colors.textSecondary}>Status</Text>
                  <Text color={colors.text}>{card.closed ? 'Closed' : card.paused ? 'Paused' : 'Active'}</Text>
                </XStack>
              </YStack>
            </Accordion>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Transaction Bottom Sheet */}
      <GBottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: colors.textSecondary }}
        handleStyle={{
          backgroundColor: colors.backgroundSecondary,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        backgroundStyle={{
          backgroundColor: colors.backgroundSecondary,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
        style={{ minHeight: 500 }}
      >
        <YStack px="$4" gap="$2" f={1}>
          <XStack ai="center" gap="$2" mb="$2">
            <History size={20} color={colors.text} />
            <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
              Card Activity
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

          <BottomSheetSectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            style={{ backgroundColor: 'transparent' }}
          />
        </YStack>
      </GBottomSheet>

      <SpendLimitSheet
        isOpen={showSpendLimitSheet}
        onClose={() => setShowSpendLimitSheet(false)}
        card={card}
        onSave={handleSpendLimitSave}
      />

      {/* Confirmation Sheet for Card Closure */}
      <BottomSheet isOpen={showConfirmClose} onClose={() => setShowConfirmClose(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Close Card
          </Text>
          <Text color={colors.textSecondary} fontSize="$4">
            Are you sure you want to close this card? This action cannot be undone.
          </Text>
          <YStack gap="$3">
            <Button
              backgroundColor={colors.danger}
              pressStyle={{ opacity: 0.8 }}
              onPress={handleConfirmClose}
              size="$5"
              borderRadius={12}
            >
              <Text color="white" fontSize="$4" fontWeight="600">
                Yes, Close Card
              </Text>
            </Button>
            <Button
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => setShowConfirmClose(false)}
              size="$5"
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.border}
            >
              <Text color={colors.text} fontSize="$4" fontWeight="600">
                Cancel
              </Text>
            </Button>
          </YStack>
        </YStack>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 0,
  },
  sectionHeader: {
    paddingVertical: 12,
    marginBottom: 8,
  },
});

export default CardDetailsScreen;
