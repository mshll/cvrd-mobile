import { View, ScrollView, YStack, Text, Separator, XStack, Button, Input } from 'tamagui';
import { StyleSheet } from 'react-native';
import { Colors } from '@/config/colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardComponent from '@/components/CardComponent';
import { useCards } from '@/hooks/useCards';
import { useMemo, useState, useCallback } from 'react';
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

const MAP_HEIGHT = 200;

const DURATION_OPTIONS = [
  { name: 'Per Transaction', value: 'per_transaction' },
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'monthly' },
  { name: 'Yearly', value: 'yearly' },
  { name: 'Total', value: 'total' },
];

const ActionButton = ({ onPress, children }) => (
  <Button
    width={60}
    height={60}
    borderRadius={15}
    backgroundColor={Colors.dark.backgroundSecondary}
    pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
    onPress={onPress}
    alignItems="center"
    justifyContent="center"
  >
    {children}
  </Button>
);

const LocationMap = ({ latitude, longitude, radius, color }) => {
  const region = {
    latitude,
    longitude,
    latitudeDelta: (radius * 2) / 69, // Convert miles to approximate degrees
    longitudeDelta: (radius * 2) / 69,
  };

  return (
    <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.dark.backgroundSecondary }}>
      <View style={{ height: MAP_HEIGHT, borderRadius: 16, overflow: 'hidden' }}>
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
            radius={radius * 1609.34} // Convert miles to meters
            strokeWidth={1}
            strokeColor={color}
            fillColor={`${color}40`}
          />
        </MapView>
      </View>
    </View>
  );
};

const SpendLimitSheet = ({ isOpen, onClose, card, onSave }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [hasLimit, setHasLimit] = useState(!!card.spending_limit);
  const [spendingLimit, setSpendingLimit] = useState(card.spending_limit?.toString() || '');
  const [durationLimit, setDurationLimit] = useState(card.duration_limit || 'per_transaction');

  const handleSave = useCallback(() => {
    onSave({
      spending_limit: parseFloat(spendingLimit),
      duration_limit: durationLimit,
      remaining_limit: parseFloat(spendingLimit),
    });
    onClose();
  }, [spendingLimit, durationLimit, onSave, onClose]);

  const handleRemoveLimit = useCallback(() => {
    onSave({
      spending_limit: null,
      duration_limit: null,
      remaining_limit: null,
    });
    onClose();
  }, [onSave, onClose]);

  const handleDurationPress = useCallback(() => {
    const options = [...DURATION_OPTIONS.map((opt) => opt.name), 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: 'Select Period',
        message: 'Choose how often the spending limit resets',
      },
      (selectedIndex) => {
        if (selectedIndex !== cancelButtonIndex) {
          setDurationLimit(DURATION_OPTIONS[selectedIndex].value);
        }
      }
    );
  }, [showActionSheetWithOptions]);

  const selectedDuration = DURATION_OPTIONS.find((opt) => opt.value === durationLimit)?.name;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aboveAll={false}>
      <YStack gap="$5" px="$4" mt="$2" pb="$6">
        <Text color={Colors.dark.text} fontSize="$6" fontFamily={'$archivoBlack'}>
          Spending Limit
        </Text>

        <YStack gap="$5">
          {/* Amount Input */}
          <YStack gap="$2">
            <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily={'$heading'}>
              Amount
            </Text>
            <XStack gap="$3" ai="center">
              <Text
                color={Colors.dark.text}
                fontSize="$7"
                fontWeight="700"
                opacity={hasLimit ? 1 : 0.5}
                fontFamily={'$archivo'}
              >
                KD
              </Text>
              <View f={1}>
                <Input
                  value={spendingLimit}
                  onChangeText={setSpendingLimit}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={0}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$7"
                  fontFamily={'$archivoBlack'}
                  p={0}
                  px="$3"
                  fontWeight="700"
                  textAlign="left"
                  disabled={!hasLimit}
                  opacity={hasLimit ? 1 : 0.5}
                />
              </View>
            </XStack>
          </YStack>

          {/* Period Selection */}
          <YStack gap="$2">
            <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily={'$heading'}>
              Period
            </Text>
            <Button
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={handleDurationPress}
              disabled={!hasLimit}
              opacity={hasLimit ? 1 : 0.5}
              size="$5"
              borderRadius={12}
              px="$3"
            >
              <XStack f={1} jc="space-between" ai="center">
                <Text color={Colors.dark.text} fontSize="$4" fontWeight="600">
                  {selectedDuration}
                </Text>
                <ChevronDownIcon size={16} color={Colors.dark.text} />
              </XStack>
            </Button>
          </YStack>
        </YStack>

        {/* Bottom Buttons */}
        <YStack gap="$3" mt="$2" borderTopWidth={1} borderTopColor={`${Colors.dark.border}80`} pt="$4">
          <Button
            backgroundColor={Colors.dark.primary}
            pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
            onPress={handleSave}
            size="$5"
            borderRadius={12}
          >
            <Text color="white" fontSize="$4" fontWeight="600">
              Set Limit
            </Text>
          </Button>
          <Button
            backgroundColor={Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={card.spending_limit ? handleRemoveLimit : onClose}
            size="$5"
            borderRadius={12}
          >
            <Text color={Colors.dark.text} fontSize="$4" fontWeight="600">
              {card.spending_limit ? 'Remove Limit' : 'Cancel'}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </BottomSheet>
  );
};

const CardDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params;
  const { getCardById, updateCard } = useCards();
  const card = getCardById(cardId);
  const [showSpendLimitSheet, setShowSpendLimitSheet] = useState(false);

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
    updateCard(cardId, updates);
  };

  const formatDurationLimit = (duration) => {
    if (!duration) return '';
    return DURATION_OPTIONS.find((opt) => opt.value === duration)?.name || duration;
  };

  return (
    <ScrollView f={1} bg={Colors.dark.background}>
      <YStack f={1} ai="center" pt="$5" pb={150}>
        <CardFlipComponent cardId={cardId} />

        {/* Action Buttons */}
        <XStack gap="$5" mt="$5" mb="$5">
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleEdit}>
              <PaintBrushIcon size={25} color={Colors.dark.text} />
            </ActionButton>
          </YStack>
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleShare}>
              <ArrowUpOnSquareIcon size={25} color={Colors.dark.text} />
            </ActionButton>
          </YStack>
          <YStack gap="$2" ai="center" jc="center">
            <ActionButton onPress={handleTogglePause}>
              {card.is_paused ? (
                <PlayIcon size={25} color={Colors.dark.text} />
              ) : (
                <PauseIcon size={25} color={Colors.dark.text} />
              )}
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
          <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.dark.backgroundSecondary }}>
            <YStack p="$4" gap="$3">
              <XStack jc="space-between" ai="center">
                <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                  Spending Limits
                </Text>
                <Button
                  size="$2"
                  backgroundColor={Colors.dark.backgroundTertiary}
                  pressStyle={{ backgroundColor: Colors.dark.border }}
                  onPress={() => setShowSpendLimitSheet(true)}
                >
                  <Text color={Colors.dark.text} fontSize="$2" fontWeight="600">
                    Edit
                  </Text>
                </Button>
              </XStack>
              {card.spending_limit ? (
                <YStack gap="$2">
                  {card.duration_limit === 'per_transaction' ? (
                    <>
                      <Text color={Colors.dark.text} fontSize="$6" fontWeight="700">
                        {formatCurrency(card.spending_limit)}
                      </Text>
                      <Text color={Colors.dark.textSecondary} fontSize="$3">
                        per transaction
                      </Text>
                    </>
                  ) : (
                    <>
                      <XStack jc="space-between">
                        <Text color={Colors.dark.text} fontSize="$6" fontWeight="700">
                          {formatCurrency(card.remaining_limit)}
                        </Text>
                        <Text color={Colors.dark.textSecondary} fontSize="$4">
                          {remainingPercentage}%
                        </Text>
                      </XStack>
                      <Text color={Colors.dark.textSecondary} fontSize="$3">
                        of {formatCurrency(card.spending_limit)} {formatDurationLimit(card.duration_limit)}
                      </Text>
                      {/* Progress Bar */}
                      <XStack
                        height={4}
                        backgroundColor={Colors.dark.backgroundTertiary}
                        borderRadius="$4"
                        mt="$2"
                        overflow="hidden"
                      >
                        <View
                          style={{
                            width: `${remainingPercentage}%`,
                            height: '100%',
                            backgroundColor: Colors.cards[card.card_color] || card.card_color,
                          }}
                        />
                      </XStack>
                    </>
                  )}
                </YStack>
              ) : (
                <Text color={Colors.dark.textSecondary} fontSize="$3">
                  No spending limit set
                </Text>
              )}
            </YStack>
          </View>

          {/* Location Map (only for location cards) */}
          {card.card_type === 'Location' && card.longitude && card.latitude && (
            <LocationMap
              latitude={card.latitude}
              longitude={card.longitude}
              radius={card.radius}
              color={Colors.cards[card.card_color]}
            />
          )}

          {/* Additional Details */}
          <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.dark.backgroundSecondary }}>
            <YStack p="$4" gap="$4">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Card Details
              </Text>

              <YStack gap="$3">
                <XStack jc="space-between">
                  <Text color={Colors.dark.textSecondary}>Card Number</Text>
                  <Text color={Colors.dark.text}>•••• {card.card_number.slice(-4)}</Text>
                </XStack>
                <Separator backgroundColor={Colors.dark.border} />

                <XStack jc="space-between">
                  <Text color={Colors.dark.textSecondary}>Expiry Date</Text>
                  <Text color={Colors.dark.text}>{new Date(card.expiry_date).toLocaleDateString()}</Text>
                </XStack>
                <Separator backgroundColor={Colors.dark.border} />

                <XStack jc="space-between">
                  <Text color={Colors.dark.textSecondary}>Created</Text>
                  <Text color={Colors.dark.text}>{new Date(card.created_at).toLocaleDateString()}</Text>
                </XStack>
                <Separator backgroundColor={Colors.dark.border} />

                {card.merchant_name && (
                  <>
                    <XStack jc="space-between">
                      <Text color={Colors.dark.textSecondary}>Merchant</Text>
                      <Text color={Colors.dark.text}>{card.merchant_name}</Text>
                    </XStack>
                    <Separator backgroundColor={Colors.dark.border} />
                  </>
                )}

                {card.category_name && (
                  <>
                    <XStack jc="space-between">
                      <Text color={Colors.dark.textSecondary}>Category</Text>
                      <Text color={Colors.dark.text}>{card.category_name}</Text>
                    </XStack>
                    <Separator backgroundColor={Colors.dark.border} />
                  </>
                )}

                <XStack jc="space-between">
                  <Text color={Colors.dark.textSecondary}>Shared</Text>
                  <Text color={Colors.dark.text}>{card.is_shared ? 'Yes' : 'No'}</Text>
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
