import { View, ScrollView, YStack, Text, Separator, XStack, Button, Input, Spinner } from 'tamagui';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors, useColors } from '@/config/colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardComponent from '@/components/CardComponent';
import { useCards } from '@/hooks/useCards';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Edit3, Pause, PauseCircle, Play, Share2, Trash2, BanknotesIcon } from '@tamagui/lucide-icons';
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
import BottomSheet from '@/components/BottomSheet';
import { useActionSheet } from '@expo/react-native-action-sheet';
import SpendLimitMenu from '@/components/SpendLimitMenu';

const MAP_HEIGHT = 200;

const DURATION_OPTIONS = [
  { name: 'Per Transaction', value: 'per_transaction' },
  { name: 'Per Day', value: 'daily' },
  { name: 'Per Week', value: 'weekly' },
  { name: 'Per Month', value: 'monthly' },
  { name: 'Per Year', value: 'yearly' },
  { name: 'Total', value: 'total' },
];

const ActionButton = ({ onPress, children }) => {
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
    >
      {children}
    </Button>
  );
};

const EditButton = ({ onPress }) => {
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
  const colors = useColors();
  const { showActionSheetWithOptions } = useActionSheet();

  // Add null checks and default values for card properties
  const initialSpendingLimit = card?.spending_limit?.toString() || '';
  const initialDurationLimit = card?.duration_limit || 'per_transaction';

  const [spendingLimit, setSpendingLimit] = useState(initialSpendingLimit);
  const [durationLimit, setDurationLimit] = useState(initialDurationLimit);

  // Reset state when card changes
  useEffect(() => {
    setSpendingLimit(card?.spending_limit?.toString() || '');
    setDurationLimit(card?.duration_limit || 'per_transaction');
  }, [card]);

  // Debug log
  console.log('💰 SpendLimitSheet:', {
    cardId: card?.id,
    hasCard: !!card,
    spendingLimit,
    durationLimit,
  });

  if (!card) {
    return null;
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aboveAll={false}>
      <SpendLimitMenu
        spendingLimit={spendingLimit}
        setSpendingLimit={setSpendingLimit}
        durationLimit={durationLimit}
        setDurationLimit={setDurationLimit}
        onSave={(updates) => {
          onSave(updates);
          onClose();
        }}
      />
    </BottomSheet>
  );
};

const CardDetailsScreen = () => {
  const colors = useColors();
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params || {};
  const { getCardById, updateCard, isLoading, error, refetch } = useCards();
  const [showSpendLimitSheet, setShowSpendLimitSheet] = useState(false);

  // Get card data
  const card = useMemo(() => {
    const foundCard = cardId ? getCardById(cardId) : null;
    console.log('📇 Card details:', { cardId, found: !!foundCard, card: foundCard });
    return foundCard;
  }, [cardId, getCardById]);

  // Refetch data when screen focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation, refetch]);

  // Show loading state while fetching card data
  if (isLoading) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Spinner size="large" color={colors.text} />
      </View>
    );
  }

  // Show error state if card not found
  if (!card || error) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background} p="$4">
        <Text color={colors.text} fontSize="$5" textAlign="center" mb="$4">
          {error ? 'Error loading card' : 'Card not found'}
        </Text>
        <YStack gap="$4" ai="center">
          {error && (
            <Button
              onPress={refetch}
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
            >
              <Text color="white">Try Again</Text>
            </Button>
          )}
          <Button
            onPress={() => navigation.goBack()}
            backgroundColor={error ? colors.backgroundSecondary : colors.primary}
            pressStyle={{ backgroundColor: error ? colors.backgroundTertiary : colors.primaryDark }}
          >
            <Text color={error ? colors.text : 'white'}>Go Back</Text>
          </Button>
        </YStack>
      </View>
    );
  }

  const remainingPercentage = useMemo(() => {
    if (!card.spending_limit || card.duration_limit === 'per_transaction') return null;
    return ((card.remaining_limit / card.spending_limit) * 100).toFixed(0);
  }, [card.remaining_limit, card.spending_limit, card.duration_limit]);

  const handleEdit = () => {
    navigation.navigate(Paths.EDIT_CARD, { cardId });
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const handleTogglePause = () => {
    // TODO: Implement pause/unpause functionality
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality with confirmation
  };

  const handleSpendLimitSave = (updates) => {
    if (!cardId) return;
    updateCard(cardId, updates);
  };

  const formatDurationLimit = (duration) => {
    if (!duration) return '';
    return DURATION_OPTIONS.find((opt) => opt.value === duration)?.name || duration;
  };

  const handleEditLocation = useCallback(() => {
    navigation.navigate(Paths.EDIT_LOCATION, { cardId });
  }, [navigation, cardId]);

  return (
    <ScrollView f={1} bg={colors.background}>
      <YStack f={1} ai="center" pt="$5" pb={150}>
        <CardFlipComponent cardId={cardId} />

        {/* Action Buttons */}
        <XStack gap="$5" mt="$5" mb="$5">
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleTogglePause}>
              {card.paused ? <PlayIcon size={25} color={colors.text} /> : <PauseIcon size={25} color={colors.text} />}
            </ActionButton>
          </YStack>
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleEdit}>
              <PaintBrushIcon size={25} color={colors.text} />
            </ActionButton>
          </YStack>
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleShare}>
              <ArrowUpOnSquareIcon size={25} color={colors.text} />
            </ActionButton>
          </YStack>
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleDelete}>
              <TrashIcon size={25} color={Colors.cards.pink} />
            </ActionButton>
          </YStack>
        </XStack>

        {/* Card Details */}
        <YStack width="100%" px="$4" gap="$4">
          {/* Spending Limit Section */}
          {card.spending_limit ? (
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
                  <EditButton onPress={() => setShowSpendLimitSheet(true)} />
                </XStack>
                <YStack gap="$2">
                  {card.duration_limit === 'per_transaction' ? (
                    <>
                      <Text color={colors.text} fontSize="$6" fontWeight="700">
                        {formatCurrency(card.spending_limit)}
                      </Text>
                      <Text color={colors.textSecondary} fontSize="$3">
                        per transaction
                      </Text>
                    </>
                  ) : (
                    <>
                      <XStack jc="space-between">
                        <Text color={colors.text} fontSize="$6" fontWeight="700">
                          {formatCurrency(card.remaining_limit)}
                        </Text>
                        <Text color={colors.textSecondary} fontSize="$4">
                          {remainingPercentage}%
                        </Text>
                      </XStack>
                      <Text color={colors.textSecondary} fontSize="$3">
                        of {formatCurrency(card.spending_limit)} {formatDurationLimit(card.duration_limit)}
                      </Text>
                      {/* Progress Bar */}
                      <XStack
                        height={4}
                        backgroundColor={colors.backgroundTertiary}
                        borderRadius="$4"
                        mt="$2"
                        overflow="hidden"
                      >
                        <View
                          style={{
                            width: `${remainingPercentage}%`,
                            height: '100%',
                            backgroundColor: Colors.cards[card.cardColor] || card.cardColor,
                          }}
                        />
                      </XStack>
                    </>
                  )}
                </YStack>
              </YStack>
            </View>
          ) : (
            <Button
              onPress={() => setShowSpendLimitSheet(true)}
              height={120}
              borderRadius={12}
              borderWidth={1}
              borderStyle="dashed"
              borderColor={colors.border}
              backgroundColor={colors.backgroundSecondary}
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
          )}

          {/* Location Map (only for location cards) */}
          {card.cardType === 'LOCATION' && card.longitude && card.latitude && (
            <LocationMap
              latitude={card.latitude}
              longitude={card.longitude}
              radius={card.radius}
              color={Colors.cards[card.cardColor]}
              onEdit={handleEditLocation}
            />
          )}

          {/* Additional Details */}
          <View
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: colors.backgroundSecondary,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <YStack p="$4" gap="$4">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Card Details
              </Text>

              <YStack gap="$3">
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
                  <Text color={colors.textSecondary}>Shared</Text>
                  <Text color={colors.text}>{card.shared ? 'Yes' : 'No'}</Text>
                </XStack>
              </YStack>
            </YStack>
          </View>
        </YStack>
      </YStack>

      <SpendLimitSheet
        isOpen={showSpendLimitSheet}
        onClose={() => setShowSpendLimitSheet(false)}
        card={card}
        onSave={handleSpendLimitSave}
      />
    </ScrollView>
  );
};

export default CardDetailsScreen;
