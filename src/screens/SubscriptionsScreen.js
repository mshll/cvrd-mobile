import { Colors, useColors } from '@/config/colors';
import { View, Text, ScrollView, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SubscriptionCard from '@/components/SubscriptionCard';
import { BellIcon } from 'react-native-heroicons/solid';
import { StyleSheet } from 'react-native';

// Dummy data for subscriptions
const DUMMY_SUBSCRIPTIONS = [
  {
    id: '1',
    merchantName: 'Netflix',
    amount: 'KD 19.99',
    nextBillingDate: '2/6/2025',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    backgroundColor: Colors.cards.pink,
  },
  {
    id: '2',
    merchantName: 'Netflix',
    amount: 'KD 14.99',
    nextBillingDate: '15/6/2025',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    backgroundColor: Colors.cards.blue,
  },
  {
    id: '3',
    merchantName: 'Netflix',
    amount: 'KD 9.99',
    nextBillingDate: '22/6/2025',
    logo: require('@/../assets/merchant-logos/Netflix.png'),
    backgroundColor: Colors.cards.green,
  },
];

const SubscriptionsScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View f={1} bg={colors.background} pt={insets.top - 20} pb={insets.bottom}>
      <ScrollView
        contentContainerStyle={[
          styles.container
        ]}
      >
        {/* Subscriptions Section */}
        <YStack px="$4" gap="$4" mb="$6">
          <XStack ai="center" gap="$2">
            <BellIcon size={20} color={colors.text} />
            <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
              Subscriptions
            </Text>
          </XStack>
        </YStack>

        {/* Subscription Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
          {DUMMY_SUBSCRIPTIONS.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
});

export default SubscriptionsScreen;
