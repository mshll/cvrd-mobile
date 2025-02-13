import { Button, Text, XStack } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';
import { XMarkIcon } from 'react-native-heroicons/solid';

const FilterBadge = ({ label, isActive, onPress, onClear }) => {
  const colors = useColors();
  return (
    <Button
      backgroundColor={isActive ? colors.primary : colors.backgroundSecondary}
      pressStyle={{ backgroundColor: isActive ? colors.primaryDark : colors.backgroundTertiary }}
      onPress={onPress}
      size="$3"
      borderRadius={20}
      borderWidth={1}
      borderColor={isActive ? colors.primary : colors.border}
      px="$3"
      height={32}
    >
      <XStack ai="center" gap="$2">
        <Text color={isActive ? 'white' : colors.text} fontSize="$3">
          {label}
        </Text>
        {isActive && (
          <Button
            size="$2"
            circular
            backgroundColor={colors.primaryDark}
            onPress={onClear}
            p={0}
            w={16}
            h={16}
          >
            <XMarkIcon size={12} color="white" />
          </Button>
        )}
      </XStack>
    </Button>
  );
};

export default FilterBadge;