import { View, Text, YStack, Input, Button, XStack, ScrollView } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, ChevronDownIcon, CalendarIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useUser } from '@/hooks/useUser';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet from '@/components/BottomSheet';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const PersonalInfoScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, updateUser, isUpdating } = useUser();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
  });
  const [showGenderSheet, setShowGenderSheet] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Validate age (must be 18 or older)
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      newErrors.dateOfBirth = 'You must be 18 or older';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (validateForm()) {
      try {
        const updatedData = {
          ...formData,
          dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
        };
        await updateUser(updatedData);
        navigation.goBack();
      } catch (error) {
        // Error handling is done in the mutation
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please check the form for errors',
      });
    }
  };

  const handleSelectGender = (selectedGender) => {
    setFormData((prev) => ({ ...prev, gender: selectedGender }));
    setShowGenderSheet(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  return (
    <View f={1} bg={colors.background} pt={insets.top}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Fixed Header */}
        <View
          backgroundColor={colors.background}
          style={{
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: `${colors.border}40`,
          }}
        >
          <XStack ai="center" jc="space-between" px="$4" pt="$2">
            <Text color={colors.text} fontSize="$6" fontFamily="Archivo-Black" fontWeight="900">
              Personal Information
            </Text>
            <Button
              size="$3"
              circular
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={() => navigation.goBack()}
              borderWidth={1}
              borderColor={colors.border}
            >
              <XMarkIcon size={20} color={colors.text} />
            </Button>
          </XStack>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: insets.bottom + 120,
          }}
        >
          {/* Form */}
          <YStack gap="$4" pb="$6">
            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                First Name
              </Text>
              <Input
                value={formData.firstName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
                placeholder="Enter your first name"
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

            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Last Name
              </Text>
              <Input
                value={formData.lastName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
                placeholder="Enter your last name"
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

            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Civil ID
              </Text>
              <Input
                value={user?.civilId || ''}
                editable={false}
                backgroundColor={`${colors.backgroundSecondary}80`}
                borderWidth={1}
                borderColor={colors.border}
                color={colors.textSecondary}
                fontSize="$4"
                height={45}
                px="$4"
                br={12}
              />
            </YStack>

            <YStack gap="$2">
              <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                Phone Number
              </Text>
              <Input
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, phoneNumber: text }))}
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
                  <Text color={colors.text} fontSize="$4">
                    {formData.dateOfBirth.toLocaleDateString()}
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
                  <Text color={formData.gender ? colors.text : colors.textTertiary} fontSize="$4">
                    {formData.gender
                      ? GENDER_OPTIONS.find((opt) => opt.value === formData.gender)?.label
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
        </ScrollView>

        {/* Save Button */}
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
            onPress={handleUpdateProfile}
            disabled={isUpdating}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="Archivo-SemiBold">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>

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
                backgroundColor={formData.gender === option.value ? colors.primary : colors.backgroundTertiary}
                pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                onPress={() => handleSelectGender(option.value)}
                size="$5"
                borderRadius={12}
              >
                <Text color={formData.gender === option.value ? 'white' : colors.text} fontSize="$4" fontWeight="600">
                  {option.label}
                </Text>
              </Button>
            ))}
          </YStack>
        </YStack>
      </BottomSheet>

      {/* Date Picker Sheet */}
      <BottomSheet isOpen={showDatePicker} onClose={() => setShowDatePicker(false)}>
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
            height={250} // Fixed height for the picker container
          >
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                textColor={colors.text}
                themeVariant={colors.colorScheme === 'dark' ? 'dark' : 'light'}
                style={{ height: 200 }} // Fixed height for iOS
              />
            ) : (
              <DateTimePicker
                value={formData.dateOfBirth}
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
    </View>
  );
};

export default PersonalInfoScreen;
