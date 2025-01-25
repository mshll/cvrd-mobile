import { View, Text, XStack, YStack } from 'tamagui';
import { Colors } from '@/config/colors';
import { StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const getTextColor = (colorName) => {
  switch (colorName) {
    case 'pink':
      return '#E14C81';
    case 'green':
      return '#44D47D';
    case 'blue':
      return '#3981A6';
    case 'yellow':
      return '#8B8534';
    default:
      return colorName;
  }
};

const getBgColor = (colorName) => {
  switch (colorName) {
    case 'pink':
      return 'rgba(225, 76, 129, 0.15)';
    case 'green':
      return 'rgba(68, 212, 125, 0.15)';
    case 'blue':
      return 'rgba(57, 129, 166, 0.15)';
    case 'yellow':
      return 'rgba(235, 225, 75, 0.15)';
    default:
      return colorName;
  }
};

const TransactionCard = ({ transaction }) => {
  const { name, amount, displayDate, status, emoji, color } = transaction;
  
  return (
    <XStack
      backgroundColor={Colors.dark.backgroundSecondary}
      p={16}
      mb={10}
      br={12}
      ai="center"
      jc="space-between"
    >
      <XStack ai="center" gap={12} f={1}>
        <View
          width={50}
          height={50}
          br={8}
          backgroundColor={Colors.dark.backgroundTertiary}
          ai="center"
          jc="center"
        >
          <Text fontSize={20}>{emoji}</Text>
        </View>
        <YStack f={1}>
          <XStack>
            <View
              backgroundColor={getBgColor(color)}
              br={20}
              px={10}
              py={2}
              fd="row"
              ai="center"
              gap={4}
              maxWidth="80%"
            >
              <Text 
                color={getTextColor(color)} 
                fontSize={14} 
                fontWeight="500"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            </View>
          </XStack>
          <Text color={Colors.dark.textSecondary} fontSize={12} mt={4}>
            {displayDate}
          </Text>
        </YStack>
      </XStack>
      <YStack ai="flex-end" ml={8}>
        <Text
          color={Colors.dark.text}
          fontSize={16}
          fontWeight="500"
        >
          - KD {amount}
        </Text>
        <Text
          color={status === 'Declined' ? Colors.dark.primary : Colors.dark.textSecondary}
          fontSize={14}
        >
          {status}
        </Text>
      </YStack>
    </XStack>
  );
};

const TransactionCardSkeleton = () => {
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

  return (
    <XStack
      backgroundColor={Colors.dark.backgroundSecondary}
      p={16}
      mb={10}
      br={12}
      ai="center"
      jc="space-between"
    >
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
  return (
    <View style={styles.content}>
      <View style={styles.sectionHeader} backgroundColor={Colors.dark.background}>
        <Text color={Colors.dark.textSecondary} fontSize={16} fontWeight="500">
          <Animated.View style={styles.skeletonMonth} />
        </Text>
      </View>
      
      {/* Show only 4 items which is typically what fits in the viewport */}
      {Array(6).fill(0).map((_, index) => (
        <TransactionCardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  skeletonIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  skeletonBadge: {
    width: 120,
    height: 26,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  skeletonDate: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    marginTop: 4,
  },
  skeletonAmount: {
    width: 80,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  skeletonStatus: {
    width: 60,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    marginTop: 4,
  },
  skeletonMonth: {
    width: 150,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
});

export { TransactionCard as default, LoadingSkeleton }; 