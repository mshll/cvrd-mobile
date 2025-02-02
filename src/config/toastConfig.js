import React from 'react';
import { View, Text, useTheme } from 'tamagui';
import { Colors } from './colors';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from 'react-native-heroicons/solid';

const ToastComponent = ({ text1, text2, type }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const theme = useTheme();

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return {
          icon: <XMarkIcon size={20} color={theme.red10.val} />,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.background}C8`,
        };
      case 'success':
        return {
          icon: <CheckCircleIcon size={20} color={theme.green10.val} />,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.background}C8`,
        };
      case 'delete':
        return {
          icon: <ExclamationTriangleIcon size={20} color={theme.red10.val} />,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.background}C8`,
        };
      default:
        return {
          icon: null,
          borderColor: `${colors.backgroundSecondary}99`,
          backgroundColor: `${colors.background}C8`,
        };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <View
      width="90%"
      height={50}
      borderRadius="$6"
      overflow="hidden"
      borderWidth={1}
      borderColor={toastStyles.borderColor}
      opacity={0.98}
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
