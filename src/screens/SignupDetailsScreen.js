import { View, Text, YStack, Input, Button, XStack } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
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

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const SignupDetailsScreen = () => {
  const colors = useColors();
  const [civilId, setCivilId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [showGenderSheet, setShowGenderSheet] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const validateForm = () => {
    const newErrors = {};

    // Validate Civil ID (12 digits)
    if (!civilId || civilId.length !== 12 || !/^\d+$/.test(civilId)) {
      newErrors.civilId = 'Civil ID must be 12 digits';
    }

    // Validate Date of Birth (18+ years)
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
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
    if (!gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Temporarily bypass validation and just navigate
    navigation.navigate(Paths.CONNECT_BANK);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleSelectGender = (selectedGender) => {
    setGender(selectedGender);
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
              <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
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
                  value={civilId}
                  onChangeText={(text) => setCivilId(text.replace(/[^0-9]/g, ''))}
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
                    <Text color={dateOfBirth ? colors.text : colors.textTertiary} fontSize="$4">
                      {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select date'}
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
                    <Text color={gender ? colors.text : colors.textTertiary} fontSize="$4">
                      {gender ? GENDER_OPTIONS.find((opt) => opt.value === gender)?.label : 'Select gender'}
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
            disabled={isLoading}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              {isLoading ? 'Creating Account...' : 'Next'}
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowDatePicker(false)}>
          <Pressable style={styles.datePickerContainer}>
            <YStack
              backgroundColor={colors.backgroundSecondary}
              br={16}
              borderWidth={1}
              borderColor={colors.border}
              overflow="hidden"
            >
              <XStack
                backgroundColor={colors.backgroundTertiary}
                py="$3"
                px="$4"
                jc="space-between"
                ai="center"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
              >
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  Select Date
                </Text>
                <Button
                  size="$3"
                  backgroundColor={colors.primary}
                  pressStyle={{ backgroundColor: colors.primaryDark }}
                  onPress={() => setShowDatePicker(false)}
                  br={8}
                >
                  <Text color="white" fontSize="$3" fontWeight="600">
                    Done
                  </Text>
                </Button>
              </XStack>

              <DateTimePicker
                value={dateOfBirth || new Date()}
                justifyContent="center"
                ai="center"
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor={colors.text}
                style={styles.datePicker}
              />
            </YStack>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal visible={showGenderSheet} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowGenderSheet(false)}>
          <Pressable style={styles.datePickerContainer}>
            <YStack
              backgroundColor={colors.backgroundSecondary}
              br={16}
              borderWidth={1}
              borderColor={colors.border}
              overflow="hidden"
              p="$4"
              gap="$3"
            >
              {GENDER_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  backgroundColor={gender === option.value ? colors.primary : colors.backgroundTertiary}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  onPress={() => handleSelectGender(option.value)}
                  size="$5"
                  borderRadius={12}
                >
                  <Text color={gender === option.value ? 'white' : colors.text} fontSize="$4" fontWeight="600">
                    {option.label}
                  </Text>
                </Button>
              ))}
            </YStack>
          </Pressable>
        </Pressable>
      </Modal>
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
