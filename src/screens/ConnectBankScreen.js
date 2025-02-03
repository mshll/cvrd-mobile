import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const ConnectBankScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [bankName, setBankName] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    // Reset navigation stack and navigate to Main
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            params: {
              screen: Paths.HOME
            }
          }
        ]
      })
    );
  };

  const handleSkip = () => {
    // Reset navigation stack and navigate to Main 
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            params: {
              screen: Paths.HOME
            }
          }
        ]
      })
    );
  };

  const handleBack = () => {
    navigation.goBack();
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
            paddingHorizontal: 16,
          }}
        >
          <YStack f={1} gap="$6">
            {/* Header with Back Button */}
            <XStack ai="center" mt="$4">
              <Button
                size="$3"
                circular
                backgroundColor={Colors.dark.backgroundSecondary}
                pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
                onPress={handleBack}
                borderWidth={1}
                borderColor={Colors.dark.border}
                mr="$4"
              >
                <ChevronLeftIcon size={20} color={Colors.dark.text} />
              </Button>
            </XStack>

            {/* Title */}
            <YStack gap="$2">
              <Text color={Colors.dark.text} fontSize="$10" fontWeight="900" fontFamily="$archivoBlack">
                CONNECT YOUR{'\n'}BANK ACCOUNT
              </Text>
              <Text color={Colors.dark.textSecondary} fontSize="$3">
                to be able to spend money from your generated cards
              </Text>
            </YStack>

            {/* Form */}
            <YStack gap="$4">
              <YStack gap="$2">
                <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
                  Bank Name
                </Text>
                <Input
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="Boubyan Bank"
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
                  IBAN Number
                </Text>
                <Input
                  value={ibanNumber}
                  onChangeText={setIbanNumber}
                  placeholder="BBYN000000000000123456"
                  keyboardType="ascii-capable"
                  autoCapitalize="characters"
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
                  Phone Number
                </Text>
                <Input
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+965 12345678"
                  keyboardType="phone-pad"
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
                  Billing Address
                </Text>
                <Input
                  value={billingAddress}
                  onChangeText={setBillingAddress}
                  placeholder="Ghazali Rd, CODED"
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
            </YStack>
          </YStack>
        </ScrollView>

        {/* Actions - Sticky Bottom */}
        <YStack
          gap="$2"
          px="$4"
          pb={insets.bottom + 16}
          pt="$4"
          borderTopWidth={1}
          borderTopColor={`${Colors.dark.border}40`}
          backgroundColor={Colors.dark.background}
        >
          <Button
            backgroundColor={Colors.dark.primary}
            pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
            onPress={handleConnect}
            disabled={isLoading}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              {isLoading ? 'Connecting...' : 'Connect Account'}
            </Text>
          </Button>

          <Button backgroundColor="transparent" onPress={handleSkip} size="$4" borderRadius={15}>
            <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
              or do this later in settings
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConnectBankScreen;
