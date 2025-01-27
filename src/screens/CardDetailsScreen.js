import { View, ScrollView, YStack, Text, Separator, XStack, Button } from 'tamagui';
import { StyleSheet } from 'react-native';
import { Colors } from '@/config/colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardComponent from '@/components/CardComponent';
import { useCards } from '@/hooks/useCards';
import { useMemo, useState } from 'react';
import { Edit3, Pause, PauseCircle, Play, Share2, Trash2 } from '@tamagui/lucide-icons';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';
import CardFlipComponent from '@/components/CardFlipComponent';
import { PaintBrushIcon, PauseIcon, PencilIcon, PlayIcon, ShareIcon, TrashIcon } from 'react-native-heroicons/solid';
import { CARD_WIDTH_LARGE, CARD_HEIGHT_LARGE } from '@/utils/cardUtils';
import { formatCurrency } from '@/utils/utils';
import { Paths } from '@/navigation/paths';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/outline';

const MAP_HEIGHT = 200;

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

const CardDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params;
  const { getCardById, updateCard } = useCards();
  const card = getCardById(cardId);

  const remainingPercentage = useMemo(() => {
    return ((card.remaining_limit / card.spending_limit) * 100).toFixed(0);
  }, [card.remaining_limit, card.spending_limit]);

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
              {card.is_paused ? <PlayIcon size={25} color={Colors.dark.text} /> : <PauseIcon size={25} color={Colors.dark.text} />}
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
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Spending Limits
              </Text>
              <YStack gap="$2">
                <XStack jc="space-between">
                  <Text color={Colors.dark.text} fontSize="$6" fontWeight="700">
                    {formatCurrency(card.remaining_limit)}
                  </Text>
                  <Text color={Colors.dark.textSecondary} fontSize="$4">
                    {remainingPercentage}%
                  </Text>
                </XStack>
                <Text color={Colors.dark.textSecondary} fontSize="$3">
                  of {formatCurrency(card.spending_limit)} {card.duration_limit}
                </Text>
                {/* Progress Bar */}
                <XStack height={4} backgroundColor={Colors.dark.backgroundTertiary} borderRadius="$4" mt="$2" overflow="hidden">
                  <View
                    style={{
                      width: `${remainingPercentage}%`,
                      height: '100%',
                      backgroundColor: Colors.cards[card.card_color] || card.card_color,
                    }}
                  />
                </XStack>
              </YStack>
            </YStack>
          </View>

          {/* Location Map (only for location cards) */}
          {card.card_type === 'Location' && card.longitude && card.latitude && (
            <LocationMap latitude={card.latitude} longitude={card.longitude} radius={card.radius} color={Colors.cards[card.card_color]} />
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
    </ScrollView>
  );
};

export default CardDetailsScreen;
