import { View, Text, YStack, Input, Button, XStack, ScrollView } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useUser } from '@/hooks/useUser';
import Toast from 'react-native-toast-message';

const SecurityScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { updateUser, isUpdating } = useUser();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (validateForm()) {
      try {
        await updateUser({ password: formData.newPassword });
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
                onPress={() => navigation.goBack()}
                borderWidth={1}
                borderColor={colors.border}
                mr="$4"
              >
                <ChevronLeftIcon size={20} color={colors.text} />
              </Button>
              <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
                Security
              </Text>
            </XStack>

            {/* Form */}
            <YStack gap="$4">
              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Current Password
                </Text>
                <XStack ai="center">
                  <Input
                    value={formData.currentPassword}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, currentPassword: text }))}
                    placeholder="Enter current password"
                    secureTextEntry={!showCurrentPassword}
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.currentPassword ? colors.primary : colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    f={1}
                    br={12}
                  />
                  <Button
                    position="absolute"
                    right={8}
                    backgroundColor="transparent"
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    pressStyle={{ opacity: 0.7 }}
                    p="$2"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </Button>
                </XStack>
                {errors.currentPassword && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.currentPassword}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  New Password
                </Text>
                <XStack ai="center">
                  <Input
                    value={formData.newPassword}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, newPassword: text }))}
                    placeholder="Enter new password"
                    secureTextEntry={!showNewPassword}
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.newPassword ? colors.primary : colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    f={1}
                    br={12}
                  />
                  <Button
                    position="absolute"
                    right={8}
                    backgroundColor="transparent"
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    pressStyle={{ opacity: 0.7 }}
                    p="$2"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </Button>
                </XStack>
                {errors.newPassword && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.newPassword}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
                  Confirm New Password
                </Text>
                <XStack ai="center">
                  <Input
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    backgroundColor={colors.backgroundSecondary}
                    borderWidth={1}
                    borderColor={errors.confirmPassword ? colors.primary : colors.border}
                    color={colors.text}
                    placeholderTextColor={colors.textTertiary}
                    fontSize="$4"
                    height={45}
                    px="$4"
                    f={1}
                    br={12}
                  />
                  <Button
                    position="absolute"
                    right={8}
                    backgroundColor="transparent"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    pressStyle={{ opacity: 0.7 }}
                    p="$2"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </Button>
                </XStack>
                {errors.confirmPassword && (
                  <Text color={colors.primary} fontSize="$2">
                    {errors.confirmPassword}
                  </Text>
                )}
              </YStack>
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
            onPress={handleUpdatePassword}
            disabled={isUpdating}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              {isUpdating ? 'Updating...' : 'Update Password'}
            </Text>
          </Button>
        </YStack>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SecurityScreen;
