import { View, Text, XStack, YStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useCards } from '@/hooks/useCards';
import TransactionDetailsSheet from './TransactionDetailsSheet';
import { format } from 'date-fns';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';

const formatTransactionDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, h:mm a');
};

const TransactionCard = ({ transaction, backgroundColor }) => {
  const colors = useColors();
  const { getCardById } = useCards();
  const [showDetails, setShowDetails] = useState(false);
  const card = getCardById(transaction.cardId);
  const bg = backgroundColor || colors.backgroundSecondary;

  // Get status info
  const getStatusInfo = (status) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'APPROVED':
      case 'SETTLED':
      case 'COMPLETED':
        return {
          color: colors.success,
          text: 'Approved',
          icon: CheckCircleIcon,
        };
      case 'DECLINED':
      case 'FAILED':
      case 'REJECTED':
        return {
          color: colors.danger,
          text: 'Declined',
          icon: XCircleIcon,
        };
      default:
        return {
          color: colors.textSecondary,
          text: status || 'Unknown',
          icon: XCircleIcon,
        };
    }
  };

  const statusInfo = getStatusInfo(transaction.status);
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <TouchableOpacity onPress={() => setShowDetails(true)} activeOpacity={0.7}>
        <XStack
          backgroundColor={bg}
          height={80}
          br={16}
          borderWidth={1}
          borderColor={colors.border}
          p={16}
          ai="center"
          jc="space-between"
          gap={16}
        >
          {/* Left section with icon and details */}
          <XStack ai="center" gap={16} f={1}>
            <View
              width={48}
              height={48}
              backgroundColor={`${card?.cardColor || colors.primary}15`}
              ai="center"
              jc="center"
              borderRadius={14}
              borderWidth={1}
              borderColor={`${card?.cardColor || colors.primary}30`}
            >
              <Text fontSize={24}>{card?.cardIcon || '💳'}</Text>
            </View>

            {/* Middle section with name and date */}
            <YStack f={1} gap={4}>
              <Text color={colors.text} fontSize={16} fontWeight="600" numberOfLines={1}>
                {transaction.merchant}
              </Text>
              <Text color={colors.textSecondary} fontSize={13} fontFamily="$mono">
                {formatTransactionDate(transaction.createdAt)}
              </Text>
            </YStack>
          </XStack>

          {/* Right section with amount and status */}
          <YStack ai="flex-end" gap={6}>
            <Text color={colors.text} fontSize={16} fontWeight="600">
              - KD {transaction.amount.toFixed(2)}
            </Text>
            <XStack ai="center" gap={4}>
              <StatusIcon size={12} color={statusInfo.color} />
              <Text color={statusInfo.color} fontSize={13} fontWeight="500">
                {statusInfo.text}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </TouchableOpacity>

      <TransactionDetailsSheet transaction={transaction} isOpen={showDetails} onClose={() => setShowDetails(false)} />
    </>
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
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.backgroundTertiary,
    },
    skeletonTitle: {
      width: 120,
      height: 20,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
    },
    skeletonDate: {
      width: 80,
      height: 16,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
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
    },
  });

  return (
    <XStack
      backgroundColor={colors.backgroundSecondary}
      height={80}
      br={16}
      borderWidth={1}
      borderColor={colors.border}
      mb={10}
      p={16}
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap={16} f={1}>
        <Animated.View style={[styles.skeletonIcon, { opacity: fadeAnim }]} />
        <YStack f={1} gap={4}>
          <Animated.View style={[styles.skeletonTitle, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.skeletonDate, { opacity: fadeAnim }]} />
        </YStack>
      </XStack>
      <YStack ai="flex-end" gap={6}>
        <Animated.View style={[styles.skeletonAmount, { opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonStatus, { opacity: fadeAnim }]} />
      </YStack>
    </XStack>
  );
};

export { TransactionCard as default, TransactionCardSkeleton as LoadingSkeleton };
