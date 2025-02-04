import { YStack, XStack, Button, Input, Text } from 'tamagui';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from '@/config/colors';
import { useState } from 'react';

const DURATION_OPTIONS = [
  { name: 'No Limit', value: 'no_limit' },
  { name: 'Per Transaction', value: 'per_transaction' },
  { name: 'Per Day', value: 'daily' },
  { name: 'Per Week', value: 'weekly' },
  { name: 'Per Month', value: 'monthly' },
  { name: 'Per Year', value: 'yearly' },
  { name: 'Total', value: 'total' },
];

const SpendLimitMenu = ({ spendingLimit, setSpendingLimit, durationLimit, setDurationLimit, onSave, darkButtons }) => {
  // Set no_limit as default
  useState(() => {
    if (!durationLimit) {
      setDurationLimit('no_limit');
    }
  }, []);

  const handleSave = () => {
    if (durationLimit === 'no_limit') {
      onSave({
        spending_limit: null,
        duration_limit: null,
        remaining_limit: null,
      });
    } else {
      onSave({
        spending_limit: parseFloat(spendingLimit),
        duration_limit: durationLimit,
        remaining_limit: parseFloat(spendingLimit),
      });
    }
  };

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
              onChangeText={setSpendingLimit}
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
                  onPress={() => setDurationLimit(option.value)}
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

        {/* Save Button */}
        <Button
          backgroundColor={Colors.dark.primary}
          pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
          onPress={handleSave}
          size="$5"
          borderRadius={12}
          mt="$2"
        >
          <Text color="white" fontSize="$4" fontWeight="600">
            Save
          </Text>
        </Button>
      </YStack>
    </TouchableWithoutFeedback>
  );
};

export default SpendLimitMenu;
