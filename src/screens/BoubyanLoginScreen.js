import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import Toast from 'react-native-toast-message';
import { connectBank } from '@/api/user';
import { useUser } from '@/hooks/useUser';

const BoubyanLoginScreen = () => {
  const colors = useColors();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { onSuccess } = route.params || {};
  const { refreshUser } = useUser();

  const validateForm = () => {
    const newErrors = {};

    if (!username || username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please check the form for errors',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await connectBank(username);
      await refreshUser();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bank account connected successfully',
      });

      if (onSuccess) {
        onSuccess(response);
      }
      navigation.goBack();
    } catch (error) {
      console.log('🔴 Error connecting bank account:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to connect bank account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View f={1} bg={colors.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <YStack f={1} px="$4" gap="$6" pt={insets.top}>
          {/* Header with Back Button */}
          <XStack ai="center" mt="$4">
            <Button
              size="$3"
              circular
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={handleBack}
              borderWidth={1}
              borderColor={colors.border}
              mr="$4"
            >
              <ChevronLeftIcon size={20} color={colors.text} />
            </Button>
            <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
              Login to Boubyan Bank
            </Text>
          </XStack>

          {/* Logo */}
          <YStack ai="center" mt="$4">
            <Image
              source={require('@/../assets/boubyan-logo.png')}
              style={{ width: 200, height: 80, resizeMode: 'contain' }}
            />
          </YStack>

          {/* Form */}
          <YStack gap="$4" mt="$4">
            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Username
              </Text>
              <Input
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                backgroundColor={colors.backgroundSecondary}
                borderWidth={1}
                borderColor={errors.username ? colors.primary : colors.border}
                color={colors.text}
                placeholderTextColor={colors.textTertiary}
                fontSize="$4"
                height={45}
                px="$4"
                br={12}
              />
              {errors.username && (
                <Text color={colors.primary} fontSize="$2">
                  {errors.username}
                </Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Password
              </Text>
              <XStack ai="center">
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={errors.password ? colors.primary : colors.border}
                  color={colors.text}
                  placeholderTextColor={colors.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  f={1}
                  br={12}
                />
                <Button
                  position="absolute"
                  right={8}
                  backgroundColor="transparent"
                  onPress={() => setShowPassword(!showPassword)}
                  pressStyle={{ opacity: 0.7 }}
                  p="$2"
                >
                  {showPassword ? (
                    <EyeSlashIcon size={20} color={colors.textSecondary} />
                  ) : (
                    <EyeIcon size={20} color={colors.textSecondary} />
                  )}
                </Button>
              </XStack>
              {errors.password && (
                <Text color={colors.primary} fontSize="$2">
                  {errors.password}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Login Button */}
          <Button
            backgroundColor={'#b72b35'}
            pressStyle={{ backgroundColor: '#c13938' }}
            onPress={handleLogin}
            disabled={isLoading}
            size="$5"
            borderRadius={100}
            mt="$4"
            mx="$4"
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              {isLoading ? 'Connecting...' : 'Connect Account'}
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </View>
  );
};

export default BoubyanLoginScreen;
