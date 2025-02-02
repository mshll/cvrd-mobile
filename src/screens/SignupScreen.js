import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

const SignupScreen = () => {
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
    setIsLoading(true);
    try {
      // TODO: Implement signup logic
      console.log('Signup with:', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
      });
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate(Paths.LOGIN);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.dark.background }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <YStack f={1} px="$4" pt={insets.top} pb={insets.bottom}>
          {/* Logo */}
          <YStack ai="flex-start" mt="$4" mb="$4">
            <Image
              source={require('@/../assets/logo-primary.png')}
              style={{ height: 40, resizeMode: 'contain', width: 100 }}
            />
          </YStack>

          {/* Title */}
          <YStack mb="$6">
            <Text
              color={Colors.dark.text}
              fontSize="$10"
              fontWeight="900"
              fontFamily="$heading"
              textAlign="left"
            >
              Create a New Account
            </Text>

            <XStack ai="center">
              <Text color={Colors.dark.textSecondary} fontSize="$3">
                Already have an account?
              </Text>
              <Button
                backgroundColor="transparent"
                onPress={handleLogin}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text color={Colors.dark.primary} fontSize="$3" fontWeight="600">
                  Login
                </Text>
              </Button>
            </XStack>
          </YStack>

          {/* Form */}
          <YStack gap="$4" mb="$6">
            {/* Name Fields */}
            <XStack gap="$3">
              <YStack gap="$2" f={1}>
                <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                  First Name
                </Text>
                <Input
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={0}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                />
              </YStack>
              <YStack gap="$2" f={1}>
                <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                  Last Name
                </Text>
                <Input
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={0}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                />
              </YStack>
            </XStack>

            <YStack gap="$2">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Email
              </Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="johndoe@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={0}
                color={Colors.dark.text}
                placeholderTextColor={Colors.dark.textTertiary}
                fontSize="$4"
                height={45}
                px="$4"
              />
            </YStack>

            <YStack gap="$2">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Password
              </Text>
              <XStack ai="center">
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••"
                  secureTextEntry={!showPassword}
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={0}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  f={1}
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="none"
                  spellCheck={false}
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
                    <EyeSlashIcon size={20} color={Colors.dark.textSecondary} />
                  ) : (
                    <EyeIcon size={20} color={Colors.dark.textSecondary} />
                  )}
                </Button>
              </XStack>
            </YStack>

            <YStack gap="$2">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Confirm Password
              </Text>
              <XStack ai="center">
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••"
                  secureTextEntry={!showConfirmPassword}
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={0}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  f={1}
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="none"
                  spellCheck={false}
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
                    <EyeSlashIcon size={20} color={Colors.dark.textSecondary} />
                  ) : (
                    <EyeIcon size={20} color={Colors.dark.textSecondary} />
                  )}
                </Button>
              </XStack>
            </YStack>

            <YStack gap="$2">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Phone Number
              </Text>
              <Input
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+123 12345678"
                keyboardType="phone-pad"
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={0}
                color={Colors.dark.text}
                placeholderTextColor={Colors.dark.textTertiary}
                fontSize="$4"
                height={45}
                px="$4"
              />
            </YStack>
          </YStack>

          {/* Actions */}
          <YStack gap="$4" mt="auto" mb={insets.bottom}>
            <Button
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={handleSignup}
              disabled={isLoading}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
                {isLoading ? 'Creating Account...' : 'Next'}
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
