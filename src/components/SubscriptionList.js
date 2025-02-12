import { View, Text, ScrollView, YStack, XStack } from 'tamagui';
import { StyleSheet } from 'react-native';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import RecurringCardComponent from './RecurringCardComponent';
import { formatDate } from '@/utils/utils';
import { Store, MapPin, Tag, Flame } from '@tamagui/lucide-icons';

const getCardIcon = (type) => {
  // Always use white color for icons
  const iconColor = '#FFFFFF';
  switch (type) {
    case 'Merchant':
      return <Store size={16} color={iconColor} />;
    case 'Location':
      return <MapPin size={16} color={iconColor} />;
    case 'Category':
      return <Tag size={16} color={iconColor} />;
    case 'Burner':
      return <Flame size={16} color={iconColor} />;
    default:
      return <Tag size={16} color={iconColor} />;
  }
};

const getBgColor = (colorName) => {
  const color = Colors.cards[colorName];
  if (!color) return colorName;
  return `${color}26`; // 15% opacity
};

const getTextColor = (colorName) => {
  return Colors.cards[colorName] || colorName;
};

const SubscriptionListItem = ({ subscription }) => {
  const colors = useColors();
  const { card_name, card_icon, card_type, card_color, next_billing_date } = subscription;

  return (
    <XStack
      w={280}
      backgroundColor={colors.card}
      p={16}
      br={12}
      borderWidth={1}
      borderColor={colors.border}
      ai="flex-start"
      gap={12}
    >
      <RecurringCardComponent type={card_type} backgroundColor={card_color} scale={0.2} />
      <YStack f={1} gap={4}>
        <XStack jc="space-between" ai="center">
          <View
            backgroundColor={getBgColor(card_color)}
            br={6}
            px={10}
            py={2}
            fd="row"
            ai="center"
            gap={4}
            maxWidth="80%"
          >
            <Text fontSize={14}>{card_icon}</Text>
            <Text color={getTextColor(card_color)} fontSize={14} fontWeight="500" numberOfLines={1}>
              {card_name}
            </Text>
          </View>
          <View opacity={0.9}>{getCardIcon(card_type)}</View>
        </XStack>
        <Text color={colors.textSecondary} fontSize={12} mt={4} fontFamily="$body">
          Next billing on {formatDate(next_billing_date)}
        </Text>
      </YStack>
    </XStack>
  );
};

const SubscriptionList = ({ subscriptions = [] }) => {
  const colors = useColors();

  if (subscriptions.length === 0) {
    return (
      <View p={16} ai="center" jc="center">
        <Text color={colors.textSecondary} fontFamily="$body">
          No active subscriptions
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {subscriptions.map((subscription, index) => (
        <View key={subscription.id || index} style={styles.cardContainer}>
          <SubscriptionListItem subscription={subscription} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  cardContainer: {
    marginRight: 10,
  },
});

export default SubscriptionList;
