import React from 'react';
import { View, Text, useTheme } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from 'react-native-heroicons/solid';

const ToastComponent = ({ text1, text2, type }) => {
  const colorScheme = useColorScheme();
  const colorSchemeInverse = colorScheme === 'dark' ? 'light' : 'dark';
  const colors = Colors[colorScheme];
  const theme = useTheme();

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: <XMarkIcon size={20} color={colors.danger} />,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.backgroundSecondary}C8`,
        };
      case 'success':
        return {
          icon: <CheckCircleIcon size={20} color={colors.success} />,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.backgroundSecondary}C8`,
        };
      case 'delete':
        return {
          icon: <ExclamationTriangleIcon size={20} color={colors.danger} />,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.backgroundSecondary}C8`,
        };
      default:
        return {
          icon: null,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.backgroundSecondary}C8`,
        };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <View
      width="95%"
      height={50}
      borderRadius="$4"
      overflow="hidden"
      borderWidth={1}
      borderColor={toastStyles.borderColor}
      opacity={0.98}
      mt={'$2.5'}
    >
      <BlurView
        intensity={colorScheme === 'dark' ? 40 : 60}
        tint={colorScheme}
        style={{
          flex: 1,
          backgroundColor: toastStyles.backgroundColor,
        }}
      >
        <View flex={1} flexDirection="row" alignItems="center" paddingHorizontal="$4" gap="$3">
          {toastStyles.icon}
          <View flex={1}>
            <Text color={colors.text} fontSize="$3" fontWeight="600" numberOfLines={1}>
              {text1}
            </Text>
            {text2 && (
              <Text color={colors.textSecondary} fontSize="$2" numberOfLines={1}>
                {text2}
              </Text>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const toastConfig = {
  error: (props) => <ToastComponent {...props} type="error" />,
  success: (props) => <ToastComponent {...props} type="success" />,
  delete: (props) => <ToastComponent {...props} type="delete" />,
};

export default toastConfig;
