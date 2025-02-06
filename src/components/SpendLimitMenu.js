import { YStack, XStack, Button, Input, Text } from 'tamagui';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from '@/config/colors';
import { useState, useEffect } from 'react';

const DURATION_OPTIONS = [
  { name: 'No Limit', value: 'no_limit' },
  { name: 'Per Transaction', value: 'per_transaction' },
  { name: 'Per Day', value: 'per_day' },
  { name: 'Per Week', value: 'per_week' },
  { name: 'Per Month', value: 'per_month' },
  { name: 'Per Year', value: 'per_year' },
  { name: 'Total', value: 'total' },
];

const SpendLimitMenu = ({ card, onSave, darkButtons }) => {
  const [spendingLimit, setSpendingLimit] = useState('');
  const [durationLimit, setDurationLimit] = useState('no_limit');

  // Initialize with existing limit if any
  useEffect(() => {
    if (card) {
      const limits = {
        per_transaction: card.per_transaction,
        per_day: card.per_day,
        per_week: card.per_week,
        per_month: card.per_month,
        per_year: card.per_year,
        total: card.total,
      };

      // Find the first non-zero limit
      const activeLimit = Object.entries(limits).find(([_, value]) => value > 0);
      if (activeLimit) {
        setDurationLimit(activeLimit[0]);
        setSpendingLimit(activeLimit[1].toString());
      } else {
        setDurationLimit('no_limit');
        setSpendingLimit('');
      }
    }
  }, [card]);

  // Update limits whenever duration or spending limit changes
  useEffect(() => {
    const updates = {
      per_transaction: 0,
      per_day: 0,
      per_week: 0,
      per_month: 0,
      per_year: 0,
      total: 0,
    };

    if (durationLimit !== 'no_limit' && spendingLimit) {
      const amount = parseFloat(spendingLimit);
      if (amount > 0) {
        updates[durationLimit] = amount;
      }
    }

    // Log the updates being saved
    console.log('💾 Auto-saving spend limits:', updates);
    onSave(updates);
  }, [durationLimit, spendingLimit]);

  const getButtonBackgroundColor = (isSelected) => {
    if (isSelected) return Colors.dark.primary;
    return darkButtons ? Colors.dark.backgroundTertiary : Colors.dark.backgroundSecondary;
  };

  const getButtonPressedColor = (isSelected) => {
    if (isSelected) return Colors.dark.primaryDark;
    return darkButtons ? Colors.dark.background : Colors.dark.backgroundTertiary;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack gap="$5" px="$4" mt="$2" pb="$6">
        <YStack gap="$5">
          {/* Amount Input */}
          <XStack
            backgroundColor={darkButtons ? Colors.dark.backgroundTertiary : Colors.dark.backgroundSecondary}
            borderRadius={16}
            height={70}
            alignItems="center"
            paddingHorizontal="$4"
            opacity={durationLimit === 'no_limit' ? 0.5 : 1}
          >
            <Text color={Colors.dark.text} fontSize="$8" fontWeight="700" fontFamily={'$archivoBlack'} mr="$2">
              KD
            </Text>
            <Input
              value={durationLimit === 'no_limit' ? '' : spendingLimit}
              onChangeText={(text) => {
                setSpendingLimit(text);
                Keyboard.dismiss();
              }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              backgroundColor="transparent"
              borderWidth={0}
              color={Colors.dark.text}
              placeholderTextColor={Colors.dark.textTertiary}
              fontSize="$8"
              fontFamily={'$archivoBlack'}
              p={0}
              fontWeight="700"
              textAlign="left"
              flex={1}
              editable={durationLimit !== 'no_limit'}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </XStack>

          {/* Period Selection */}
          <XStack flexWrap="wrap" gap="$1">
            {DURATION_OPTIONS.map((option, index) => {
              const isNoLimit = option.value === 'no_limit';
              const isSelected = durationLimit === option.value;

              // Skip no_limit in regular grid calculations
              const gridIndex = isNoLimit ? 0 : index - 1;
              const isFirstRow = isNoLimit || gridIndex < 2;
              const isLastRow = !isNoLimit && gridIndex >= DURATION_OPTIONS.length - 3;
              const isFirstInRow = isNoLimit || gridIndex % 2 === 0;
              const isLastInRow = isNoLimit || (!isNoLimit && gridIndex % 2 === 1);

              let borderRadius = {
                borderTopLeftRadius: isNoLimit ? 12 : 0,
                borderTopRightRadius: isNoLimit ? 12 : 0,
                borderBottomLeftRadius: !isNoLimit && isLastRow && isFirstInRow ? 12 : 0,
                borderBottomRightRadius: !isNoLimit && isLastRow && isLastInRow ? 12 : 0,
              };

              return (
                <Button
                  key={option.value}
                  backgroundColor={getButtonBackgroundColor(isSelected)}
                  pressStyle={{
                    backgroundColor: getButtonPressedColor(isSelected),
                  }}
                  onPress={() => {
                    setDurationLimit(option.value);
                    if (isNoLimit) {
                      setSpendingLimit('');
                    }
                  }}
                  flex={isNoLimit ? 2 : 1}
                  height={50}
                  minWidth={isNoLimit ? '100%' : '48%'}
                  {...borderRadius}
                >
                  <Text color={isSelected ? 'white' : Colors.dark.text} fontSize="$3" fontWeight="600">
                    {option.name}
                  </Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
};

export default SpendLimitMenu;
