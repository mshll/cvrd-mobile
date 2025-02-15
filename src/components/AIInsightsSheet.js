import React from 'react';
import { ScrollView } from 'react-native';
import { Text, YStack, XStack, View } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';
import BottomSheet from '@/components/BottomSheet';
import { ChartBarIcon, BanknotesIcon, ClockIcon, ShoppingBagIcon, LightBulbIcon } from 'react-native-heroicons/solid';
import { Spinner } from 'tamagui';

function InsightSection({ title, items, icon: Icon }) {
  const colors = useColors();
  return (
    <YStack gap="$2" mb="$4">
      <XStack ai="center" gap="$2">
        <Icon size={20} color={colors.primary} />
        <Text color={colors.text} fontSize="$4" fontWeight="600">
          {title}
        </Text>
      </XStack>
      {typeof items === 'string' ? (
        <Text color={colors.text} fontSize="$3">
          {items}
        </Text>
      ) : (
        items.map((item, index) => (
          <XStack key={index} gap="$2">
            <Text color={colors.textSecondary}>•</Text>
            <Text color={colors.text} fontSize="$3">
              {item}
            </Text>
          </XStack>
        ))
      )}
    </YStack>
  );
}

export function AIInsightsSheet({ isOpen, onClose, insights, isLoading }) {
  const colors = useColors();

  if (!insights && !isLoading) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ScrollView>
        <YStack px="$4" pt="$4" pb="$10">
          <Text color={colors.text} fontSize="$6" fontWeight="700" mb="$4">
            AI Spending Analysis
          </Text>

          {isLoading ? (
            <YStack ai="center" jc="center" h={200}>
              <Spinner size="large" color={colors.text} />
            </YStack>
          ) : (
            <>
              <InsightSection title="Spending Overview" items={insights.overview} icon={ChartBarIcon} />
              <InsightSection title="Potential Savings" items={insights.savings} icon={BanknotesIcon} />
              <InsightSection title="Subscription Analysis" items={insights.subscriptionAdvice} icon={ClockIcon} />
              <InsightSection title="Smart Shopping Tips" items={insights.shoppingTips} icon={ShoppingBagIcon} />
              <InsightSection title="Future Recommendations" items={insights.recommendations} icon={LightBulbIcon} />
            </>
          )}
        </YStack>
      </ScrollView>
    </BottomSheet>
  );
}
