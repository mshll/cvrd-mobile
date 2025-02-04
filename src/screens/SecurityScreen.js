import { View, Text, YStack, XStack, Button, Input, ScrollView } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/solid';
import Toast from 'react-native-toast-message';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  isPasswordVisible,
}) => (
  <YStack gap="$2">
    <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600">
      {label}
    </Text>
    <XStack ai="center">
      <Input
        flex={1}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        backgroundColor={Colors.dark.backgroundSecondary}
        borderWidth={1}
        borderColor={Colors.dark.border}
        color={Colors.dark.text}
        placeholderTextColor={Colors.dark.textTertiary}
        fontSize="$4"
        height={45}
        px="$4"
        borderRadius={12}
        textContentType="none"
        autoComplete="off"
      />
      {showPasswordToggle && (
        <Button
          position="absolute"
          right={8}
          backgroundColor="transparent"
          onPress={onTogglePassword}
          pressStyle={{ opacity: 0.7 }}
          p="$2"
        >
          {isPasswordVisible ? (
            <EyeSlashIcon size={20} color={Colors.dark.textSecondary} />
          ) : (
            <EyeIcon size={20} color={Colors.dark.textSecondary} />
          )}
        </Button>
      )}
    </XStack>
  </YStack>
);

const SecurityScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    // Validate passwords
    if (!currentPassword) {
      Toast.show({
        type: 'error',
        text1: 'Current password is required',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });
      return;
    }

    if (newPassword.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 8 characters',
      });
      return;
    }

    // Here you would typically make an API call to update the password
    Toast.show({
      type: 'success',
      text1: 'Password Updated',
      text2: 'Your password has been changed successfully',
    });
    navigation.goBack();
  };

  return (
    <View f={1} bg={Colors.dark.background}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <YStack gap="$6">
          <Text color={Colors.dark.text} fontSize="$5" fontFamily="$archivoBlack">
            Change Password
          </Text>

          {/* Current Password */}
          <FormInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
            showPasswordToggle
            isPasswordVisible={showCurrentPassword}
            onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          {/* New Password */}
          <FormInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
            showPasswordToggle
            isPasswordVisible={showNewPassword}
            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
          />

          {/* Confirm Password */}
          <FormInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            showPasswordToggle
            isPasswordVisible={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />
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
            Update Password
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
};

export default SecurityScreen;
