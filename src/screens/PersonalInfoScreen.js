import { View, Text, YStack, XStack, Button, Input, ScrollView } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { user } from '@/data/user';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDownIcon, CalendarIcon } from 'react-native-heroicons/solid';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import BottomSheet from '@/components/BottomSheet';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const FormInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default', secureTextEntry = false }) => (
  <YStack gap="$2">
    <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
      {label}
    </Text>
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      backgroundColor={Colors.dark.backgroundSecondary}
      borderWidth={1}
      borderColor={Colors.dark.border}
      color={Colors.dark.text}
      placeholderTextColor={Colors.dark.textTertiary}
      fontSize="$4"
      height={45}
      px="$4"
      borderRadius={12}
    />
  </YStack>
);

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Form state
  const [firstName, setFirstName] = useState(user.name.split(' ')[0]);
  const [lastName, setLastName] = useState(user.name.split(' ')[1] || '');
  const [email, setEmail] = useState(user.email);
  const [civilId, setCivilId] = useState(user.civil_id || '');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(user.date_of_birth || Date.now()));
  const [gender, setGender] = useState(user.gender || 'male');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleSave = () => {
    // Here you would typically make an API call to update the user's information
    // For now, we'll just show a success message
    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your information has been saved successfully',
    });
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleGenderSelect = (value) => {
    setGender(value);
    setShowGenderPicker(false);
  };

  return (
    <View f={1} bg={Colors.dark.background}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <YStack gap="$6">
          {/* Name */}
          <XStack gap="$3">
            <View f={1}>
              <FormInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
            </View>
            <View f={1}>
              <FormInput label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Enter last name" />
            </View>
          </XStack>

          {/* Email */}
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          {/* Civil ID */}
          <FormInput
            label="Civil ID"
            value={civilId}
            onChangeText={setCivilId}
            placeholder="Enter civil ID"
            keyboardType="numeric"
          />

          {/* Date of Birth */}
          <YStack gap="$2">
            <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
              Date of Birth
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={1}
                borderColor={Colors.dark.border}
                height={45}
                px="$4"
                borderRadius={12}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text color={Colors.dark.text} fontSize="$4">
                  {dateOfBirth.toLocaleDateString()}
                </Text>
                <CalendarIcon size={20} color={Colors.dark.textSecondary} />
              </View>
            </TouchableOpacity>
          </YStack>

          {/* Gender */}
          <YStack gap="$2">
            <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
              Gender
            </Text>
            <TouchableOpacity onPress={() => setShowGenderPicker(true)}>
              <View
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={1}
                borderColor={Colors.dark.border}
                height={45}
                px="$4"
                borderRadius={12}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text color={Colors.dark.text} fontSize="$4">
                  {GENDER_OPTIONS.find((option) => option.value === gender)?.label || 'Select Gender'}
                </Text>
                <ChevronDownIcon size={20} color={Colors.dark.textSecondary} />
              </View>
            </TouchableOpacity>
          </YStack>
        </YStack>

        {/* Save Button */}
        <Button
          mt="$6"
          backgroundColor={Colors.dark.primary}
          pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
          onPress={handleSave}
          size="$5"
          borderRadius={12}
        >
          <Text color="white" fontSize="$4" fontWeight="600">
            Save Changes
          </Text>
        </Button>
      </ScrollView>

      {/* Date Picker Sheet */}
      <BottomSheet isOpen={showDatePicker} onClose={() => setShowDatePicker(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <XStack jc="space-between" ai="center">
            <Text color={Colors.dark.text} fontSize="$6" fontFamily="$archivoBlack">
              Date of Birth
            </Text>
            <Button
              size="$3"
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={() => setShowDatePicker(false)}
              borderRadius={8}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Done
              </Text>
            </Button>
          </XStack>
          <View
            backgroundColor={Colors.dark.backgroundSecondary}
            br={12}
            p="$4"
            borderWidth={1}
            borderColor={Colors.dark.border}
          >
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              textColor={Colors.dark.text}
              themeVariant="dark"
            />
          </View>
        </YStack>
      </BottomSheet>

      {/* Gender Selection Sheet */}
      <BottomSheet isOpen={showGenderPicker} onClose={() => setShowGenderPicker(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={Colors.dark.text} fontSize="$6" fontFamily="$archivoBlack">
            Select Gender
          </Text>
          <YStack gap="$2">
            {GENDER_OPTIONS.map((option) => (
              <Button
                key={option.value}
                backgroundColor={gender === option.value ? Colors.dark.primary : Colors.dark.backgroundSecondary}
                pressStyle={{
                  backgroundColor: gender === option.value ? Colors.dark.primaryDark : Colors.dark.backgroundTertiary,
                }}
                onPress={() => handleGenderSelect(option.value)}
                size="$5"
                borderRadius={12}
                borderWidth={1}
                borderColor={gender === option.value ? Colors.dark.primary : Colors.dark.border}
              >
                <Text color={gender === option.value ? 'white' : Colors.dark.text} fontSize="$4" fontWeight="600">
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

export default PersonalInfoScreen;
