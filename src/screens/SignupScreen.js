import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

const SignupScreen = () => {
  const colors = useColors();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleSignup = async () => {
    // Temporarily bypass validation and just navigate
    navigation.navigate(Paths.SIGNUP_DETAILS);
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
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="John"
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    br={12}
                  />
                </YStack>
                <YStack gap="$2" f={1}>
                  <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                    Last Name
                  </Text>
                  <Input
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Doe"
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    br={12}
                  />
                </YStack>
              </XStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Email
                </Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="johndoe@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={colors.border}
                  color={colors.text}
                  placeholderTextColor={colors.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  br={12}
                />
              </YStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Password
                </Text>
                <XStack ai="center">
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••"
                    secureTextEntry={!showPassword}
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={colors.border}
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
                    borderColor={colors.border}
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
              </YStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Phone Number
                </Text>
                <Input
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+123 12345678"
                  keyboardType="phone-pad"
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={colors.border}
                  color={colors.text}
                  placeholderTextColor={colors.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  br={12}
                />
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
            disabled={isLoading}
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
