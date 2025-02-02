import { StyleSheet, Alert } from 'react-native';
import { View, Text, XStack, Button, YStack } from 'tamagui';
import { Colors } from '@/config/colors';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import CardComponent from '@/components/CardComponent';
import { useState } from 'react';
import { Paths } from '@/navigation/paths';

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

const CardReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cardType, cardData } = route.params;
  const [remainingGenerations, setRemainingGenerations] = useState(INITIAL_GENERATIONS);

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
            // Here you would typically make an API call to create the card
            setRemainingGenerations((prev) => prev - 1);

            // Reset navigation state and navigate to Home tab
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    state: {
                      routes: [{ name: Paths.HOME }],
                      index: 0,
                    },
                  },
                ],
              })
            );
          },
        },
      ]
    );
  };

  return (
    <View f={1} bg={Colors.dark.background}>
      <View style={styles.container}>
        <View f={1} gap="$4">
          {/* Card Preview Section */}
          <YStack gap="$2" ai="center">
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
          <XStack ai="center" mt="$2" mb="$2" justifyContent="space-between">
            <Text color={Colors.dark.textSecondary} fontSize="$4" fontWeight="600">
              Remaining Card Generations:
            </Text>
            <Text color={Colors.dark.text} fontSize="$4" fontWeight="700" fontFamily="$heading">
              {remainingGenerations}
            </Text>
          </XStack>

          {/* Card Details */}
          <YStack
            gap="$2"
            backgroundColor={Colors.dark.backgroundSecondary}
            p="$3"
            borderRadius={12}
          >
            <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily="$heading">
              Card Details
            </Text>

            <XStack jc="space-between">
              <Text color={Colors.dark.textSecondary}>Type</Text>
              <Text color={Colors.dark.text}>{cardType}</Text>
            </XStack>

            <XStack jc="space-between">
              <Text color={Colors.dark.textSecondary}>Name</Text>
              <Text color={Colors.dark.text}>{cardData.name}</Text>
            </XStack>

            {cardType === 'Category' && cardData.category && (
              <XStack jc="space-between">
                <Text color={Colors.dark.textSecondary}>Category</Text>
                <Text color={Colors.dark.text}>{cardData.category.name}</Text>
              </XStack>
            )}

            {cardType === 'Location' && (
              <XStack jc="space-between">
                <Text color={Colors.dark.textSecondary}>Radius</Text>
                <Text color={Colors.dark.text}>{cardData.radius}m</Text>
              </XStack>
            )}

            <XStack jc="space-between">
              <Text color={Colors.dark.textSecondary}>Transaction Limit</Text>
              <Text color={Colors.dark.text}>{cardData.limits.transaction} KWD</Text>
            </XStack>

            <XStack jc="space-between">
              <Text color={Colors.dark.textSecondary}>Monthly Limit</Text>
              <Text color={Colors.dark.text}>{cardData.limits.monthly} KWD</Text>
            </XStack>
          </YStack>
        </View>

        {/* Bottom Buttons */}
        <XStack
          width="100%"
          gap="$10"
          borderTopWidth={1}
          borderTopColor={`${Colors.dark.border}40`}
          pt="$4"
          mt="$4"
          jc="space-between"
          bottom={100}
        >
          <Button
            f={1}
            backgroundColor={Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={() => navigation.goBack()}
            size="$5"
            borderRadius={15}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

export default CardReviewScreen;
