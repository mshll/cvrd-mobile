import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Paths } from '@/navigation/paths';
import { useAuthContext } from '@/context/AuthContext';
import { useSignup } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import BottomSheet from '@/components/BottomSheet';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const SignupDetailsScreen = () => {
  const colors = useColors();
  const { signupData, updateSignupData, resetSignupData } = useAuthContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderSheet, setShowGenderSheet] = useState(false);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const signupMutation = useSignup();

  const validateForm = () => {
    // console.log('🔍 Validating details form with data:', {
    //   civilId: signupData.civilId,
    //   dateOfBirth: signupData.dateOfBirth,
    //   gender: signupData.gender,
    // });
    const newErrors = {};

    // Validate Civil ID (12 digits)
    if (!signupData.civilId || signupData.civilId.length !== 12 || !/^\d+$/.test(signupData.civilId)) {
      newErrors.civilId = 'Civil ID must be 12 digits';
    }

    // Validate Date of Birth (18+ years)
    if (!signupData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(signupData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be 18 or older';
      }
    }

    // Validate Gender
    if (!signupData.gender) {
      newErrors.gender = 'Gender is required';
    }

    //console.log('📋 Validation errors:', Object.keys(newErrors).length ? newErrors : 'No errors');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    //console.log('👉 Starting account creation process...');
    if (validateForm()) {
      try {
        // Format date to ISO string for API
        const formattedData = {
          ...signupData,
          dateOfBirth: signupData.dateOfBirth.toISOString().split('T')[0],
        };

        //console.log('📤 Submitting signup data to API:', formattedData);
        const response = await signupMutation.mutateAsync(formattedData);
        //console.log('✅ Account created successfully, navigating to connect bank');
        navigation.navigate(Paths.CONNECT_BANK, { registrationData: response });
      } catch (error) {
        console.log('❌ Account creation failed:', error);
        // Error handling is done in the mutation
      }
    } else {
      //console.log('❌ Details form validation failed');
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please check the form for errors',
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      updateSignupData({ dateOfBirth: selectedDate });
    }
  };

  const handleSelectGender = (selectedGender) => {
    //console.log('👤 Gender selected:', selectedGender);
    updateSignupData({ gender: selectedGender });
    setShowGenderSheet(false);
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
              <Text color={colors.text} fontSize="$6" fontFamily="Archivo-Black" fontWeight="900">
                Additional Details
              </Text>
            </XStack>

            {/* Form */}
            <YStack gap="$4">
              {/* Civil ID */}
              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Civil ID
                </Text>
                <Input
                  value={signupData.civilId}
                  onChangeText={(text) => updateSignupData({ civilId: text.replace(/[^0-9]/g, '') })}
                  placeholder="Enter your Civil ID"
                  keyboardType="numeric"
                  maxLength={12}
                  backgroundColor={colors.backgroundSecondary}
                  borderWidth={1}
                  borderColor={errors.civilId ? colors.primary : colors.border}
                  color={colors.text}
                  placeholderTextColor={colors.textTertiary}
                  fontSize="$4"
                  height={45}
                  px="$4"
                  br={12}
                />
                {errors.civilId && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.civilId}
                  </Text>
                )}
              </YStack>

              {/* Date of Birth */}
              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Date of Birth
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <XStack
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.dateOfBirth ? colors.primary : colors.border}
                    br={12}
                    height={45}
                    px="$4"
                    ai="center"
                    jc="space-between"
                  >
                    <Text color={signupData.dateOfBirth ? colors.text : colors.textTertiary} fontSize="$4">
                      {signupData.dateOfBirth ? signupData.dateOfBirth.toLocaleDateString() : 'Select date'}
                    </Text>
                    <CalendarIcon size={20} color={colors.textSecondary} />
                  </XStack>
                </TouchableOpacity>
                {errors.dateOfBirth && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.dateOfBirth}
                  </Text>
                )}
              </YStack>

              {/* Gender */}
              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Gender
                </Text>
                <TouchableOpacity onPress={() => setShowGenderSheet(true)}>
                  <XStack
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.gender ? colors.primary : colors.border}
                    br={12}
                    height={45}
                    px="$4"
                    ai="center"
                    jc="space-between"
                  >
                    <Text color={signupData.gender ? colors.text : colors.textTertiary} fontSize="$4">
                      {signupData.gender
                        ? GENDER_OPTIONS.find((opt) => opt.value === signupData.gender)?.label
                        : 'Select gender'}
                    </Text>
                    <ChevronDownIcon size={20} color={colors.textSecondary} />
                  </XStack>
                </TouchableOpacity>
                {errors.gender && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.gender}
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
            onPress={handleNext}
            disabled={signupMutation.isPending}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="Archivo-SemiBold">
              {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>

      {/* Date Picker Sheet */}
      <BottomSheet isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} enableContentPanningGesture={false}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <XStack jc="space-between" ai="center">
            <Text color={colors.text} fontSize="$6" fontFamily="Archivo-Black" fontWeight="900">
              Date of Birth
            </Text>
            <Button
              size="$3"
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={() => setShowDatePicker(false)}
              borderRadius={8}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Done
              </Text>
            </Button>
          </XStack>
          <View
            backgroundColor={colors.backgroundSecondary}
            br={12}
            p="$4"
            borderWidth={1}
            borderColor={colors.border}
            height={250}
          >
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={signupData.dateOfBirth || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                textColor={colors.text}
                themeVariant={colors.colorScheme === 'dark' ? 'dark' : 'light'}
                style={{ height: 200 }}
              />
            ) : (
              <DateTimePicker
                value={signupData.dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>
        </YStack>
      </BottomSheet>

      {/* Gender Selection Sheet */}
      <BottomSheet isOpen={showGenderSheet} onClose={() => setShowGenderSheet(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="Archivo-Black" fontWeight="900">
            Select Gender
          </Text>
          <YStack gap="$3">
            {GENDER_OPTIONS.map((option) => (
              <Button
                key={option.value}
                backgroundColor={signupData.gender === option.value ? colors.primary : colors.backgroundTertiary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={() => handleSelectGender(option.value)}
                size="$5"
                borderRadius={12}
              >
                <Text color={signupData.gender === option.value ? 'white' : colors.text} fontSize="$4" fontWeight="600">
                  {option.label}
                </Text>
              </Button>
            ))}
          </YStack>
        </YStack>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '90%',
    maxWidth: 400,
  },
  datePicker: {
    height: 200,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
});

export default SignupDetailsScreen;
