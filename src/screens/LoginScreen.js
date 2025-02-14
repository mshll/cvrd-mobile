import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors, useAppTheme, useColors } from '@/context/ColorSchemeContext';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useLogin } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const loginMutation = useLogin();
  const { effectiveColorScheme } = useAppTheme();

  const validateForm = () => {
    console.log('🔍 Validating login form with:', { email });
    const newErrors = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Valid email is required';
    }

    // Validate password
    if (!password || password.length < 2) {
      newErrors.password = 'Password must be at least 2 characters';
    }

    console.log('📋 Validation errors:', Object.keys(newErrors).length ? newErrors : 'No errors');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    console.log('👉 Starting login process...');
    if (validateForm()) {
      try {
        console.log('✅ Form validation passed, attempting login');
        await loginMutation.mutateAsync({ email, password });
        console.log('🎉 Login successful, navigating to main app');
      } catch (error) {
        console.log('❌ Login failed');
        // Error handling is done in the mutation
      }
    } else {
      console.log('❌ Form validation failed');
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please check the form for errors',
      });
    }
  };

  const handleSignUp = () => {
    navigation.navigate(Paths.SIGNUP);
  };

  return (
    <View f={1} bg={colors.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top,
          }}
        >
          <YStack f={1} px="$4" gap="$6">
            {/* Logo */}
            <YStack ai="flex-start" mt="$4">
              <Image
                source={
                  effectiveColorScheme === 'dark'
                    ? require('@/../assets/logo-primary.png')
                    : require('@/../assets/logo-primary-dark.png')
                }
                style={{ height: 40, resizeMode: 'contain', width: 100 }}
              />
            </YStack>

            {/* Title */}
            <YStack gap="$2">
              <Text color={colors.text} fontSize="$10" fontWeight="900" fontFamily="$archivoBlack">
                Sign in to Your Account
              </Text>
              <XStack ai="center" gap="$2">
                <Text color={colors.textSecondary} fontSize="$3">
                  Don't have an account?
                </Text>
                <TouchableOpacity backgroundColor="transparent" onPress={handleSignUp} pressStyle={{ opacity: 0.7 }}>
                  <Text color={colors.primary} fontSize="$3" fontWeight="600">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </XStack>
            </YStack>

            {/* Form */}
            <YStack gap="$4">
              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Email
                </Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={errors.email ? colors.primary : colors.border}
                  color={colors.text}
                  placeholderTextColor={colors.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  br={12}
                />
                {errors.email && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.email}
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
                    textContentType="none"
                    autoComplete="off"
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
              <XStack jc="flex-end">
                <Button backgroundColor="transparent" onPress={() => {}} pressStyle={{ opacity: 0.7 }}>
                  <Text color={colors.primary} fontSize="$3">
                    Forgot Password?
                  </Text>
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>

        {/* Actions - Sticky Bottom */}
        <YStack
          gap="$4"
          px="$4"
          pb={insets.bottom + 16}
          pt="$4"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          borderTopWidth={1}
          borderTopColor={`${colors.border}40`}
          backgroundColor={colors.background}
        >
          <Button
            backgroundColor={colors.primary}
            pressStyle={{ backgroundColor: colors.primaryDark }}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              {loginMutation.isPending ? 'Signing in...' : 'Login'}
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
