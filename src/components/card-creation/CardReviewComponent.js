import { StyleSheet, Alert } from 'react-native';
import { View, Text, XStack, Button, YStack } from 'tamagui';
import { Colors } from '@/config/colors';
import CardComponent from '@/components/CardComponent';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

// Default card configurations for each type
const DEFAULT_CARD_CONFIGS = {
  Merchant: {
    emoji: '🛍️',
    color: Colors.cards.green,
  },
  Category: {
    emoji: '📅',
    color: Colors.cards.pink,
  },
  Location: {
    emoji: '📍',
    color: Colors.cards.blue,
  },
  Burner: {
    emoji: '🔥',
    color: Colors.cards.yellow,
  },
};

// Mock remaining generations (replace with actual data from your backend)
const INITIAL_GENERATIONS = 3;

const LIMIT_LABELS = {
  per_transaction: 'Per Transaction',
  per_day: 'Per Day',
  per_week: 'Per Week',
  per_month: 'Per Month',
  per_year: 'Per Year',
  total: 'Total',
  no_limit: 'No Limit'
};

const CardReviewComponent = ({ cardType, cardData, onBack, onCreateCard }) => {
  const [remainingGenerations, setRemainingGenerations] = useState(INITIAL_GENERATIONS);
  const insets = useSafeAreaInsets();

  // Function to format limit value
  const formatLimit = (value) => {
    if (value === null) return 'No Limit';
    return `${value.toLocaleString()} KWD`;
  };

  // Get all non-null limits
  const getActiveLimits = () => {
    if (!cardData.limits) return [];
    return Object.entries(cardData.limits)
      .filter(([key, value]) => {
        // Include if it's either a number greater than 0 or explicitly set to null (no limit)
        return (typeof value === 'number' && value > 0) || value === null;
      })
      .map(([key, value]) => ({
        label: LIMIT_LABELS[key] || key,
        value: formatLimit(value)
      }))
      .sort((a, b) => {
        // Custom sort order: Per Transaction -> Per Day -> Per Week -> Per Month -> Per Year -> Total -> No Limit
        const order = {
          'Per Transaction': 1,
          'Per Day': 2,
          'Per Week': 3,
          'Per Month': 4,
          'Per Year': 5,
          'Total': 6,
          'No Limit': 7
        };
        return order[a.label] - order[b.label];
      });
  };

  const activeLimits = getActiveLimits();

  const handleCreateCard = () => {
    Alert.alert(
      'Create Card',
      `Are you sure you want to create this ${cardType} card? You have ${remainingGenerations} generations remaining.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: () => {
            setRemainingGenerations((prev) => prev - 1);
            onCreateCard(cardData);
          },
        },
      ]
    );
  };

  return (
    <View f={1} bg={Colors.dark.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <YStack gap="$5">
          {/* Card Preview Section */}
          <YStack gap="$3" ai="center">
            <View scale={0.8}>
              <CardComponent
                displayData={{
                  type: cardType,
                  label: cardData.name,
                  emoji: DEFAULT_CARD_CONFIGS[cardType].emoji,
                  lastFourDigits: '••••',
                  backgroundColor: DEFAULT_CARD_CONFIGS[cardType].color,
                  isPaused: false,
                  isClosed: false,
                }}
              />
            </View>
          </YStack>

          {/* Remaining Generations */}
          <View style={{ 
            borderRadius: 16, 
            overflow: 'hidden', 
            backgroundColor: Colors.dark.backgroundSecondary,
            borderWidth: 1,
            borderColor: Colors.dark.border
          }}>
            <XStack ai="center" p="$4" justifyContent="space-between">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Remaining Card Generations
              </Text>
              <Text color={Colors.dark.text} fontSize="$4" fontWeight="700" fontFamily="$heading">
                {remainingGenerations}
              </Text>
            </XStack>
          </View>

          {/* Card Details */}
          <View style={{ 
            borderRadius: 16, 
            overflow: 'hidden', 
            backgroundColor: Colors.dark.backgroundSecondary,
            borderWidth: 1,
            borderColor: Colors.dark.border
          }}>
            <YStack p="$4" gap="$4">
              <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily="$heading">
                Card Details
              </Text>

              <YStack gap="$3">
                <XStack jc="space-between">
                  <Text color={Colors.dark.textSecondary} fontSize="$3">Type</Text>
                  <Text color={Colors.dark.text} fontSize="$3" fontWeight="600">{cardType}</Text>
                </XStack>

                <XStack jc="space-between">
                  <Text color={Colors.dark.textSecondary} fontSize="$3">Name</Text>
                  <Text color={Colors.dark.text} fontSize="$3" fontWeight="600">{cardData.name}</Text>
                </XStack>

                {cardType === 'Category' && cardData.category && (
                  <XStack jc="space-between">
                    <Text color={Colors.dark.textSecondary} fontSize="$3">Category</Text>
                    <XStack gap="$2" ai="center">
                      <Text fontSize="$3">{cardData.category.emoji}</Text>
                      <Text color={Colors.dark.text} fontSize="$3" fontWeight="600">
                        {cardData.category.name}
                      </Text>
                    </XStack>
                  </XStack>
                )}

                {cardType === 'Location' && (
                  <XStack jc="space-between">
                    <Text color={Colors.dark.textSecondary} fontSize="$3">Radius</Text>
                    <Text color={Colors.dark.text} fontSize="$3" fontWeight="600">
                      {cardData.radius.toFixed(1)} km
                    </Text>
                  </XStack>
                )}
              </YStack>
            </YStack>
          </View>

          {/* Spending Limits */}
          {activeLimits.length > 0 && (
            <View style={{ 
              borderRadius: 16, 
              overflow: 'hidden', 
              backgroundColor: Colors.dark.backgroundSecondary,
              borderWidth: 1,
              borderColor: Colors.dark.border
            }}>
              <YStack p="$4" gap="$4">
                <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily="$heading">
                  Spending Limits
                </Text>

                <YStack gap="$3">
                  {activeLimits.map((limit, index) => (
                    <XStack key={index} jc="space-between">
                      <Text color={Colors.dark.textSecondary} fontSize="$3">{limit.label}</Text>
                      <Text color={Colors.dark.text} fontSize="$3" fontWeight="600">{limit.value}</Text>
                    </XStack>
                  ))}
                </YStack>
              </YStack>
            </View>
          )}

          {/* Bottom Buttons */}
          <XStack
            width="100%"
            gap="$12"
            borderTopWidth={1}
            borderTopColor={`${Colors.dark.border}40`}
            pt="$4"
            mt="auto"
            mb={insets.bottom + 50}
            jc="space-between"
          >
            <Button
              f={1}
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={onBack}
              size="$5"
              borderRadius={15}
              borderWidth={1}
              borderColor={Colors.dark.border}
            >
              <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Back
              </Text>
            </Button>
            <Button
              f={1}
              backgroundColor={
                remainingGenerations > 0 ? Colors.dark.primary : Colors.dark.backgroundTertiary
              }
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={handleCreateCard}
              disabled={remainingGenerations === 0}
              size="$5"
              borderRadius={15}
            >
              <Text
                color={remainingGenerations > 0 ? 'white' : Colors.dark.textSecondary}
                fontSize="$4"
                fontWeight="600"
                fontFamily="$archivo"
              >
                Create Card
              </Text>
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
});

export default CardReviewComponent;
