import { View, ScrollView, YStack, Text, Separator, XStack, Button, Input, Spinner } from 'tamagui';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCards } from '@/hooks/useCards';
import { useCardMutations } from '@/hooks/useCardMutations';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { History } from '@tamagui/lucide-icons';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';
import CardFlipComponent from '@/components/CardFlipComponent';
import { PaintBrushIcon, PauseIcon, PlayIcon, TrashIcon, MapPinIcon, StarIcon } from 'react-native-heroicons/solid';
import { StarIcon as StarIconOutline } from 'react-native-heroicons/outline';
import { formatCurrency } from '@/utils/utils';
import { Paths } from '@/navigation/paths';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/outline';
import SpendLimitMenu from '@/components/SpendLimitMenu';
import Toast from 'react-native-toast-message';
import { useTransactions } from '@/hooks/useTransactions';
import GBottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Accordion from '@/components/Accordion';
import BottomSheet from '@/components/BottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TransactionList from '@/components/TransactionList';

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
  const mapRef = useRef(null);
  const [location, setLocation] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  const region = useMemo(
    () => ({
      latitude,
      longitude,
      latitudeDelta: (radius * 2) / 50,
      longitudeDelta: (radius * 2) / 50,
    }),
    [latitude, longitude, radius]
  );

  // Get user's current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    })();
  }, []);

  // Update map region when coordinates change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 500);
    }
  }, [region]);

  const getLocationInfo = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response[0]) {
        const locationInfo = response[0];

        // Create formatted address with just street and country
        const formattedAddress = [locationInfo.street, locationInfo.country].filter(Boolean).join(', ');

        // Update the location object with the address
        setLocation((prev) => ({
          ...prev,
          latitude,
          longitude,
          address: formattedAddress,
          country: locationInfo.country,
        }));
      }
    } catch (error) {
      console.error('Error getting location info:', error);
    }
  };

  useEffect(() => {
    getLocationInfo(latitude, longitude);
  }, [latitude, longitude]);

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
      <View style={{ height: MAP_HEIGHT, overflow: 'hidden' }}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <Marker coordinate={{ latitude, longitude }} pinColor={color} />
          <MapCircle
            center={{ latitude, longitude }}
            radius={radius * 1000} // Convert km to meters
            fillColor={`${color}20`}
            strokeColor={color}
            strokeWidth={2}
          />
          {userLocation && (
            <MapCircle
              center={userLocation}
              radius={10}
              fillColor={colors.primary}
              strokeColor={colors.primaryDark}
              strokeWidth={2}
            />
          )}
        </MapView>

        {onEdit && (
          <XStack position="absolute" top={12} right={12} gap="$2">
            <Button
              size="$2"
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={onEdit}
              borderWidth={1}
              borderColor={colors.border}
              br={8}
              px="$3"
            >
              <Text color={colors.text} fontSize="$2" fontWeight="600">
                Edit
              </Text>
            </Button>
          </XStack>
        )}
      </View>

      <YStack px={12} py={12} gap={8} borderTopWidth={1} borderTopColor={colors.border}>
        <XStack jc="space-between" ai="center">
          <XStack ai="center" gap="$2">
            {/* <View backgroundColor={`${color}15`} p="$2" br={8}>
              <MapPinIcon size={16} color={color} />
            </View> */}
            <Text color={colors.text} fontSize="$4" fontWeight="600">
              {location.address}
            </Text>
          </XStack>
        </XStack>

        <Text color={colors.textSecondary} fontSize="$3" fontFamily="$mono">
          {radius.toFixed(1)} km radius
        </Text>
      </YStack>
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

const ActivitySection = ({ transactions = [], isLoading = false }) => {
  const colors = useColors();

  return (
    <YStack f={1} gap="$4">
      <TransactionList
        transactions={transactions}
        showHeader={false}
        containerStyle={{ paddingTop: 8 }}
        sectionBackground={colors.backgroundSecondary}
        cardBackgroundColor={colors.backgroundTertiary}
      />
    </YStack>
  );
};

const CardDetailsScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params || {};
  const { getCardById, isLoading: isCardsLoading, refetch: refetchCards } = useCards();
  const { updateCardLimitMutation, togglePauseMutation, togglePinMutation, closeCardMutation } = useCardMutations();
  const [showSpendLimitSheet, setShowSpendLimitSheet] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '50%', '90%'], []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get card data
  const card = useMemo(() => {
    const foundCard = cardId ? getCardById(cardId) : null;
    return foundCard;
  }, [cardId, getCardById]);

  // Get active spending limit
  const activeSpendingLimit = useMemo(() => getActiveSpendingLimit(card), [card]);

  // Get transactions for this card
  const {
    data: cardTransactions = [],
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useTransactions(cardId);

  // Add refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchCards(), refetchTransactions()]);
    } catch (error) {
      console.error('Error refreshing card details:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchCards, refetchTransactions]);

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

  const handleTogglePin = () => {
    if (card && !card.closed) {
      togglePinMutation.mutate(cardId);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Cannot Pin Card',
        text2: 'This card is closed and cannot be modified',
      });
    }
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
      <ScrollView
        f={1}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.text}
            colors={[colors.primary]} // Android
            progressBackgroundColor={colors.backgroundSecondary} // Android
            progressViewOffset={10}
          />
        }
      >
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
              <ActionButton onPress={handleTogglePin} disabled={card.closed}>
                {card.pinned ? (
                  <StarIcon size={25} color={colors.text} />
                ) : (
                  <StarIconOutline size={25} color={colors.text} />
                )}
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
              <LocationMap
                latitude={card.latitude}
                longitude={card.longitude}
                radius={card.radius}
                color={Colors.cards[card.cardColor] || card.cardColor}
                onEdit={handleEditLocation}
              />
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
        <BottomSheetView style={{ flex: 1 }}>
          <YStack gap="$2" f={1}>
            <XStack ai="center" gap="$2" my="$2" px="$4">
              <History size={20} color={colors.text} />
              <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
                Card Activity
              </Text>
            </XStack>

            {cardTransactions.length === 0 ? (
              <YStack f={1} ai="center" jc="flex-start" gap="$4" px="$4" pt="$6">
                <History size={40} color={colors.primary} />
                <YStack ai="center" gap="$2">
                  <Text color={colors.text} fontSize="$5" fontWeight="600" textAlign="center">
                    No Transactions Found
                  </Text>
                  <Text color={colors.textSecondary} fontSize="$3" textAlign="center">
                    Transactions for this card will appear here
                  </Text>
                </YStack>
              </YStack>
            ) : (
              <ActivitySection transactions={cardTransactions} />
            )}
          </YStack>
        </BottomSheetView>
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
              backgroundColor={`${colors.danger}10`}
              pressStyle={{ backgroundColor: `${colors.danger}20` }}
              onPress={handleConfirmClose}
              size="$5"
              borderRadius={12}
              borderWidth={1}
              borderColor={`${colors.danger}30`}
            >
              <Text color={colors.danger} fontSize="$4" fontWeight="600">
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
