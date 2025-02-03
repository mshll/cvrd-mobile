import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
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
      // Temporarily navigate to main app without authentication
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
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
    <View f={1} bg={Colors.dark.background}>
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
              <Text color={Colors.dark.text} fontSize="$10" fontWeight="900" fontFamily="$archivoBlack">
                Sign in to Your Account
              </Text>
              <XStack ai="center" gap="$2">
                <Text color={Colors.dark.textSecondary} fontSize="$3">
                  Don't have an account?
                </Text>
                <TouchableOpacity backgroundColor="transparent" onPress={handleSignUp} pressStyle={{ opacity: 0.7 }}>
                  <Text color={Colors.dark.primary} fontSize="$3" fontWeight="600">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </XStack>
            </YStack>

            {/* Form */}
            <YStack gap="$4">
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
                  borderWidth={1}
                  borderColor={Colors.dark.border}
                  color={Colors.dark.text}
                  placeholderTextColor={Colors.dark.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  br={12}
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
                    borderWidth={1}
                    borderColor={Colors.dark.border}
                    color={Colors.dark.text}
                    placeholderTextColor={Colors.dark.textTertiary}
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
                      <EyeSlashIcon size={20} color={Colors.dark.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={Colors.dark.textSecondary} />
                    )}
                  </Button>
                </XStack>
              </YStack>
              <XStack jc="flex-end">
                <Button backgroundColor="transparent" onPress={() => {}} pressStyle={{ opacity: 0.7 }}>
                  <Text color={Colors.dark.primary} fontSize="$3">
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
          borderTopColor={`${Colors.dark.border}40`}
          backgroundColor={Colors.dark.background}
        >
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
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
