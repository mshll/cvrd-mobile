import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export function useBiometricAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = async () => {
    try {
      setIsAuthenticating(true);

      // Check if device supports biometric authentication
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      console.log('🔐 Biometric hardware support:', hasHardware);

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('🔐 Supported authentication types:', supportedTypes);

      // Check specifically for Face ID support
      const hasFaceId = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      console.log('🔐 Has Face ID:', hasFaceId);

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('🔐 Biometric enrollment status:', isEnrolled);

      if (!hasHardware || !isEnrolled) {
        const message = !hasHardware
          ? 'Your device does not support biometric authentication.'
          : 'No biometric authentication is set up on this device. Please set up Face ID in your device settings.';

        Alert.alert('Biometric Authentication Unavailable', message);
        return false;
      }

      // Attempt biometric authentication with Face ID specific configuration
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID to create your card',
        fallbackLabel: 'Use passcode instead',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        preferredAuthenticationMethods: hasFaceId
          ? [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]
          : undefined,
      });

      console.log('🔐 Authentication result:', result);

      if (result.success) {
        return true;
      }

      if (result.error === 'not_enrolled') {
        Alert.alert('Face ID Not Set Up', 'Please set up Face ID in your device settings to use this feature.');
      } else if (result.error === 'user_cancel') {
        Toast.show({
          type: 'info',
          text1: 'Authentication Cancelled',
          text2: 'Card creation was cancelled',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Authentication Required',
          text2: 'Please authenticate to create your card',
        });
      }

      return false;
    } catch (error) {
      console.log('Authentication error:', error);

      // More detailed error information
      if (error.code) {
        console.log('Error code:', error.code);
      }
      if (error.message) {
        console.log('Error message:', error.message);
      }

      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: error.message || 'An error occurred during authentication',
      });
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    authenticate,
    isAuthenticating,
  };
}
