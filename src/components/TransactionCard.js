import { View, Text, XStack, YStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { useCards } from '@/hooks/useCards';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

const formatTransactionDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${month} ${day}, ${formattedHours}:${minutes} ${period}`;
};

const TransactionCard = ({ transaction }) => {
  const colors = useColors();
  const navigation = useNavigation();
  const { getCardById } = useCards();
  const { name, amount, date, status, cardId } = transaction;
  const card = getCardById(cardId);

  // If card is not found, use a default color
  const cardColor = card?.cardColor || Colors.cards.blue;
  const bgColor = `${cardColor}26`; // 15% opacity

  const handlePress = () => {
    if (card) {
      navigation.navigate(Paths.CARD_DETAILS, {
        cardId: card.id,
      });
    }
  };

  return (

    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <XStack
        backgroundColor={colors.card}
        p={16}
        mb={10}
        br={12}
        ai="center"
        jc="space-between"
        borderWidth={1}
        borderColor={colors.border}
      >
        <XStack ai="center" gap={12} f={1}>
          <View width={50} height={50} br={8} backgroundColor={colors.backgroundTertiary} ai="center" jc="center">
            <Text fontSize={20}>{card?.cardIcon || '💳'}</Text>
          </View>
          <YStack f={1}>
            <XStack>
              <View backgroundColor={bgColor} br={6} px={'$2'} py={'$1.5'} fd="row" ai="center" gap={4} maxWidth="80%">
                <Text color={cardColor} fontSize={14} fontWeight="500" numberOfLines={1} ellipsizeMode="tail">
                  {name}
                </Text>
              </View>
            </XStack>
            <Text color={colors.textSecondary} fontSize={12} mt={4}>
              {formatTransactionDate(date)}
            </Text>
          </YStack>
        </XStack>
        <YStack ai="flex-end" ml={8}>
          <Text color={colors.text} fontSize={16} fontWeight="500">
            - KD {amount}
          </Text>
          <Text color={status === 'Declined' ? colors.primary : colors.textSecondary} fontSize={14}>
            {status}
          </Text>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
};

const TransactionCardSkeleton = () => {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const styles = StyleSheet.create({
    skeletonIcon: {
      width: 50,
      height: 50,
      borderRadius: 8,
      backgroundColor: colors.backgroundTertiary,
    },
    skeletonBadge: {
      width: 120,
      height: 26,
      borderRadius: 20,
      backgroundColor: colors.backgroundTertiary,
    },
    skeletonDate: {
      width: 100,
      height: 16,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
      marginTop: 4,
    },
    skeletonAmount: {
      width: 80,
      height: 20,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
    },
    skeletonStatus: {
      width: 60,
      height: 16,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
      marginTop: 4,
    },
  });

  return (
    <XStack backgroundColor={colors.card} p={16} mb={10} br={12} ai="center" jc="space-between">
      <XStack ai="center" gap={12} f={1}>
        <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
        <YStack f={1}>
          <XStack>
            <Animated.View style={[styles.skeletonBadge, { opacity: fadeAnim }]} />
          </XStack>
          <Animated.View style={[styles.skeletonDate, { opacity: fadeAnim }]} />
        </YStack>
      </XStack>
      <YStack ai="flex-end" ml={8}>
        <Animated.View style={[styles.skeletonAmount, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonStatus, { opacity: fadeAnim }]} />
      </YStack>
    </XStack>
  );
};

const LoadingSkeleton = () => {
  const colors = useColors();

  const styles = StyleSheet.create({
    content: {
      paddingHorizontal: 20,
    },
    sectionHeader: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    skeletonMonth: {
      width: 150,
      height: 20,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
    },
  });

  return (
    <View style={styles.content}>
      <View style={styles.sectionHeader} backgroundColor={colors.background}>
        <Animated.View style={styles.skeletonMonth} />
      </View>

      {/* Show only 4 items which is typically what fits in the viewport */}
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <TransactionCardSkeleton key={index} />
        ))}
    </View>
  );
};

export { TransactionCard as default, LoadingSkeleton };
