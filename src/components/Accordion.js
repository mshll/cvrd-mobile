import { View, Text, YStack, Button, XStack } from 'tamagui';
import { useColors } from '@/context/ColorSchemeContext';
import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/outline';
import { Animated, LayoutAnimation } from 'react-native';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const animation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggleAccordion = () => {
    const toValue = !isOpen ? 1 : 0;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(150, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );

    setIsOpen(!isOpen);
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      damping: 20,
      mass: 1,
      stiffness: 100,
    }).start();
  };

  const contentStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  const iconStyle = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  return (
    <View
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Button
        onPress={toggleAccordion}
        backgroundColor="transparent"
        pressStyle={{ backgroundColor: colors.backgroundTertiary }}
        p="$4"
        borderRadius={0}
      >
        <YStack gap="$2" width="100%">
          <XStack jc="space-between" ai="center">
            <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
              {title}
            </Text>
            <Animated.View style={iconStyle}>
              <ChevronDownIcon size={20} color={colors.textSecondary} />
            </Animated.View>
          </XStack>
        </YStack>
      </Button>

      {isOpen && (
        <Animated.View style={[{ paddingHorizontal: 16 }, contentStyle]}>
          <YStack py="$4" gap="$4">
            {children}
          </YStack>
        </Animated.View>
      )}
    </View>
  );
};

export default Accordion;
