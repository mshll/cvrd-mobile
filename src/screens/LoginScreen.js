import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement login logic
      console.log('Login with:', { email, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate(Paths.SIGNUP);
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
          <YStack mb="$8">
            <Text
              color={Colors.dark.text}
              fontSize="$10"
              fontWeight="900"
              fontFamily="$heading"
              textAlign="left"
            >
              Sign in to your Account
            </Text>
            <XStack ai="center">
              <Text color={Colors.dark.textSecondary} fontSize="$3">
                Don't have an account?
              </Text>
              <Button
                backgroundColor="transparent"
                onPress={handleSignUp}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text color={Colors.dark.primary} fontSize="$3" fontWeight="600">
                  Sign up
                </Text>
              </Button>
            </XStack>
          </YStack>

          {/* Form */}
          <YStack gap="$4" mb="$6">
            <YStack gap="$2">
              <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                Email
              </Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  backgroundColor={Colors.dark.backgroundSecondary}
                  borderWidth={0}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  f={1}
                  textContentType="none"
                  autoComplete="off"
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

            <XStack jc="flex-end">
              <Button
                backgroundColor="transparent"
                onPress={() => {}}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text color={Colors.dark.primary} fontSize="$3" fontWeight="600">
                  Forgot Password?
                </Text>
              </Button>
            </XStack>
          </YStack>

          {/* Actions */}
          <YStack gap="$4" mt="auto">
            <Button
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={handleLogin}
              disabled={isLoading}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
                {isLoading ? 'Signing in...' : 'Login'}
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
