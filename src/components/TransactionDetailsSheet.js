import { View, Text, YStack, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCards } from '@/hooks/useCards';
import {
  ClockIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
  TagIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/solid';
import { format, isValid, parseISO } from 'date-fns';
import { formatCurrency } from '@/utils/utils';
import BottomSheet from '@/components/BottomSheet';

const DetailRow = ({ icon: Icon, label, value }) => {
  const colors = useColors();
  return (
    <XStack ai="center" jc="space-between" py="$3">
      <XStack ai="center" gap="$3">
        <Icon size={20} color={colors.text} />
        <Text color={colors.textSecondary} fontSize="$3">
          {label}
        </Text>
      </XStack>
      <Text color={colors.text} fontSize="$3" fontWeight="600">
        {value}
      </Text>
    </XStack>
  );
};

const TransactionDetailsSheet = ({ transaction, isOpen, onClose }) => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getCardById } = useCards();

  // Get the associated card
  const card = transaction?.cardId ? getCardById(transaction.cardId) : null;

  // Format date with validation
  const formatTransactionDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        throw new Error('Invalid date');
      }
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Date unavailable';
    }
  };

  const formattedDate = formatTransactionDate(transaction?.createdAt);

  // Status color and text
  const getStatusInfo = (status) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'APPROVED':
      case 'SETTLED':
      case 'COMPLETED':
        return {
          color: Colors.cards.green,
          text: status || 'Approved',
          icon: CheckCircleIcon,
        };
      case 'DECLINED':
      case 'FAILED':
      case 'REJECTED':
        return {
          color: Colors.cards.red,
          text: status || 'Declined',
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

  const statusInfo = getStatusInfo(transaction?.status);
  const StatusIcon = statusInfo.icon;

  if (!transaction) return null;

  console.log(transaction);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <YStack gap="$4" px="$4" pt="$2" pb={insets.bottom + 20}>
        {/* Title */}
        {/* <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
          Transaction Details
        </Text> */}

        {/* Amount and Status */}
        <YStack ai="center" gap="$2" py="$4">
          <Text color={colors.text} fontSize="$10" fontWeight="800" fontFamily="$archivoBlack">
            {formatCurrency(transaction.amount || 0)}
          </Text>
          <XStack ai="center" gap="$2">
            <StatusIcon size={16} color={statusInfo.color} />
            <Text color={statusInfo.color} fontSize="$3" fontWeight="600">
              {statusInfo.text}
            </Text>
          </XStack>
          {transaction.declineReason && (
            <Text color={Colors.cards.red} fontSize="$2" fontWeight="500" mt="$1" textAlign="center" px="$4">
              {transaction.declineReason}
            </Text>
          )}
        </YStack>

        {/* Details */}
        <View
          backgroundColor={colors.backgroundSecondary}
          borderRadius={16}
          borderWidth={1}
          borderColor={colors.border}
          px="$4"
        >
          <DetailRow
            icon={BuildingStorefrontIcon}
            label="Merchant"
            value={transaction.merchant || 'Unknown Merchant'}
          />
          <DetailRow icon={CreditCardIcon} label="Card" value={card ? card.cardName : 'Unknown Card'} />
          <DetailRow icon={ClockIcon} label="Date" value={formattedDate} />
          {transaction.category && <DetailRow icon={TagIcon} label="Category" value={transaction.category} />}
          {transaction.recurring !== undefined && (
            <DetailRow icon={ArrowPathIcon} label="Recurring" value={transaction.recurring ? 'Yes' : 'No'} />
          )}
        </View>
      </YStack>
    </BottomSheet>
  );
};

export default TransactionDetailsSheet;
