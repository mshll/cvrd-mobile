import { View, ScrollView, YStack, Text, Separator, XStack, Button, Input, Spinner } from 'tamagui';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors, useColors } from '@/config/colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardComponent from '@/components/CardComponent';
import { useCards } from '@/hooks/useCards';
import { useCardMutations } from '@/hooks/useCardMutations';
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
import Toast from 'react-native-toast-message';

const MAP_HEIGHT = 200;

// Helper function to get active spending limit
function getActiveSpendingLimit(card) {
  if (!card) return null;

  const limits = [
    { type: 'per_transaction', value: card.per_transaction, label: 'Per Transaction' },
    { type: 'per_day', value: card.per_day, label: 'Per Day' },
    { type: 'per_week', value: card.per_week, label: 'Per Week' },
    { type: 'per_month', value: card.per_month, label: 'Per Month' },
    { type: 'per_year', value: card.per_year, label: 'Per Year' },
    { type: 'total', value: card.total, label: 'Total' },
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

const CardDetailsScreen = () => {
  const colors = useColors();
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params || {};
  const { getCardById, isLoading: isCardsLoading } = useCards();
  const { updateCardLimitMutation, togglePauseMutation, closeCardMutation } = useCardMutations();
  const [showSpendLimitSheet, setShowSpendLimitSheet] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Get card data
  const card = useMemo(() => {
    const foundCard = cardId ? getCardById(cardId) : null;
    console.log('📇 Card details:', { cardId, found: !!foundCard, card: foundCard });
    return foundCard;
  }, [cardId, getCardById]);

  // Get active spending limit
  const activeSpendingLimit = useMemo(() => getActiveSpendingLimit(card), [card]);

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

    // Find the first non-zero limit
    const activeLimit = Object.entries(updates).find(([_, value]) => value > 0);

    if (activeLimit) {
      const [limitType, amount] = activeLimit;
      updateCardLimitMutation.mutate({
        cardId,
        limitType,
        amount,
      });
    }
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
                  <Text color={colors.text} fontSize="$6" fontWeight="700">
                    {formatCurrency(activeSpendingLimit.value)}
                  </Text>
                  <Text color={colors.textSecondary} fontSize="$3">
                    {activeSpendingLimit.label}
                  </Text>
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
                  <Text color={colors.textSecondary}>Status</Text>
                  <Text color={colors.text}>{card.closed ? 'Closed' : card.paused ? 'Paused' : 'Active'}</Text>
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
    </ScrollView>
  );
};

export default CardDetailsScreen;
