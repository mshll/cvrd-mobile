import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useAuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';

const SignupScreen = () => {
  const colors = useColors();
  const { signupData, updateSignupData } = useAuthContext();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const validateForm = () => {
    console.log('🔍 Validating signup form with data:', signupData);
    const newErrors = {};

    // Validate first name
    if (!signupData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name
    if (!signupData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupData.email || !emailRegex.test(signupData.email)) {
      newErrors.email = 'Valid email is required';
    }

    // Validate password
    if (!signupData.password || signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (signupData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate phone number
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!signupData.phoneNumber || !phoneRegex.test(signupData.phoneNumber)) {
      newErrors.phoneNumber = 'Valid phone number is required';
    }

    console.log('📋 Validation errors:', Object.keys(newErrors).length ? newErrors : 'No errors');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    console.log('👉 Starting signup process...');
    if (validateForm()) {
      console.log('✅ Form validation passed, navigating to details screen');
      navigation.navigate(Paths.SIGNUP_DETAILS);
    } else {
      console.log('❌ Form validation failed');
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please check the form for errors',
      });
    }
  };

  const handleLogin = () => {
    navigation.navigate(Paths.LOGIN);
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
                source={require('@/../assets/logo-primary.png')}
                style={{ height: 40, resizeMode: 'contain', width: 100 }}
              />
            </YStack>

            {/* Title */}
            <YStack gap="$2">
              <Text color={colors.text} fontSize="$10" fontWeight="900" fontFamily="$archivoBlack">
                Create a New Account
              </Text>
              <XStack ai="center" gap="$2">
                <Text color={colors.textSecondary} fontSize="$3">
                  Already have an account?
                </Text>
                <TouchableOpacity backgroundColor="transparent" onPress={handleLogin} pressStyle={{ opacity: 0.7 }}>
                  <Text color={colors.primary} fontSize="$3" fontWeight="600">
                    Login
                  </Text>
                </TouchableOpacity>
              </XStack>
            </YStack>

            {/* Form */}
            <YStack gap="$4">
              {/* Name Fields */}
              <XStack gap="$3">
                <YStack gap="$2" f={1}>
                  <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                    First Name
                  </Text>
                  <Input
                    value={signupData.firstName}
                    onChangeText={(text) => updateSignupData({ firstName: text })}
                    placeholder="John"
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.firstName ? colors.primary : colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    br={12}
                  />
                  {errors.firstName && (
                    <Text color={colors.primary} fontSize="$2">
                      {errors.firstName}
                    </Text>
                  )}
                </YStack>
                <YStack gap="$2" f={1}>
                  <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                    Last Name
                  </Text>
                  <Input
                    value={signupData.lastName}
                    onChangeText={(text) => updateSignupData({ lastName: text })}
                    placeholder="Doe"
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.lastName ? colors.primary : colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    br={12}
                  />
                  {errors.lastName && (
                    <Text color={colors.primary} fontSize="$2">
                      {errors.lastName}
                    </Text>
                  )}
                </YStack>
              </XStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Email
                </Text>
                <Input
                  value={signupData.email}
                  onChangeText={(text) => updateSignupData({ email: text })}
                  placeholder="johndoe@gmail.com"
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
                    value={signupData.password}
                    onChangeText={(text) => updateSignupData({ password: text })}
                    placeholder="••••••"
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
                    textContentType="oneTimeCode"
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
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

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Confirm Password
                </Text>
                <XStack ai="center">
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••"
                    secureTextEntry={!showConfirmPassword}
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.confirmPassword ? colors.primary : colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    f={1}
                    textContentType="oneTimeCode"
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    br={12}
                  />
                  <Button
                    position="absolute"
                    right={8}
                    backgroundColor="transparent"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    pressStyle={{ opacity: 0.7 }}
                    p="$2"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </Button>
                </XStack>
                {errors.confirmPassword && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.confirmPassword}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Phone Number
                </Text>
                <Input
                  value={signupData.phoneNumber}
                  onChangeText={(text) => updateSignupData({ phoneNumber: text })}
                  placeholder="+123 12345678"
                  keyboardType="phone-pad"
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={errors.phoneNumber ? colors.primary : colors.border}
                  color={colors.text}
                  placeholderTextColor={colors.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  br={12}
                />
                {errors.phoneNumber && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.phoneNumber}
                  </Text>
                )}
              </YStack>
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
            onPress={handleSignup}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              Next
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;
