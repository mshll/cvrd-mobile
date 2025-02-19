import { View, Text, YStack, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ChevronLeftIcon, CheckCircleIcon } from 'react-native-heroicons/outline';
import { setToken } from '@/api/storage';
import { useAuthContext } from '@/context/AuthContext';

const ConnectBankScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { setUser } = useAuthContext();
  const registrationData = route.params?.registrationData;
  const [connectedBank, setConnectedBank] = useState(null);

  const finishRegistration = async () => {
    if (registrationData?.token) {
      await setToken(registrationData.token);
      setUser(registrationData);
    }
  };

  const handleConnectBank = () => {
    navigation.navigate('BoubyanLogin', {
      onSuccess: (data) => {
        setConnectedBank(data);
      },
      token: registrationData?.token,
    });
  };

  const handleSkip = async () => {
    await finishRegistration();
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
          </XStack>

          {/* Title */}
          <YStack gap="$2">
            <Text color={colors.text} fontSize="$10" fontWeight="900" fontFamily="Archivo-Black">
              CONNECT YOUR{'\n'}BANK ACCOUNT
            </Text>
            <Text color={colors.textSecondary} fontSize="$3">
              to be able to spend money from your generated cards
            </Text>
          </YStack>

          {/* Bank Connection Status */}
          {connectedBank ? (
            <YStack
              backgroundColor={colors.backgroundSecondary}
              p="$4"
              br={16}
              borderWidth={1}
              borderColor={colors.border}
              gap="$2"
            >
              <XStack ai="center" gap="$2">
                <CheckCircleIcon size={20} color={Colors.cards.green} />
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  Bank Account Connected
                </Text>
              </XStack>
              <Text color={colors.textSecondary} fontSize="$3">
                Account Number: {connectedBank.bankAccountNumber}
              </Text>
              <Text color={colors.textSecondary} fontSize="$3">
                Username: {connectedBank.bankAccountUsername}
              </Text>
            </YStack>
          ) : (
            <Button
              size="$6"
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={handleConnectBank}
              borderWidth={1}
              borderColor={colors.border}
              br={16}
            >
              <XStack ai="center" gap="$3">
                <Image
                  source={require('@/../assets/boubyan-logo-min.png')}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  Login with Boubyan Bank
                </Text>
              </XStack>
            </Button>
          )}
        </YStack>

        {/* Actions - Sticky Bottom */}
        <YStack
          gap="$2"
          px="$4"
          pb={insets.bottom + 16}
          pt="$4"
          borderTopWidth={1}
          borderTopColor={`${colors.border}40`}
          backgroundColor={colors.background}
        >
          {connectedBank ? (
            <Button
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={finishRegistration}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily="Archivo-SemiBold">
                Continue
              </Text>
            </Button>
          ) : (
            <Button backgroundColor="transparent" onPress={handleSkip} size="$4" borderRadius={15}>
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Skip for now
              </Text>
            </Button>
          )}
        </YStack>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConnectBankScreen;
