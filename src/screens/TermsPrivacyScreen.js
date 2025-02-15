import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Text, YStack, XStack, Button, ScrollView } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { XMarkIcon } from 'react-native-heroicons/outline';

const Section = ({ title, content }) => {
  const colors = useColors();
  return (
    <YStack mb="$6">
      <Text color={colors.text} fontSize="$5" fontWeight="700" mb="$3">
        {title}
      </Text>
      <Text color={colors.textSecondary} fontSize="$3" lineHeight={20}>
        {content}
      </Text>
    </YStack>
  );
};

const TermsPrivacyScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const sections = [
    {
      title: 'Terms of Service',
      content:
        'By using our app, you agree to these terms. The app provides virtual card services for online transactions. We reserve the right to modify or discontinue the service at any time. Users must be 18 or older and provide accurate information. Misuse may result in account termination.',
    },
    {
      title: 'Privacy Policy',
      content:
        'We collect information to provide and improve our services. This includes transaction data, device information, and usage patterns. We use industry-standard security measures to protect your data. We never sell personal information to third parties.',
    },
    {
      title: 'Data Collection',
      content:
        'We collect: Personal information (name, email, phone), Transaction data, Device information, Usage data. This data helps us provide services, prevent fraud, and improve user experience.',
    },
    {
      title: 'Security',
      content:
        'We use encryption and secure protocols to protect your data. All card information is tokenized. We regularly audit our security measures and follow industry best practices for data protection.',
    },
    {
      title: 'User Responsibilities',
      content:
        'Users must maintain account security, report unauthorized access, and use the service legally. You are responsible for all activities under your account. Do not share account credentials.',
    },
  ];

  return (
    <View f={1} bg={colors.background}>
      {/* Header */}
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
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack" fontWeight="900">
            Terms & Privacy
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

      <ScrollView
        f={1}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text color={colors.textSecondary} fontSize="$3" mb="$6">
          Last updated: March 15, 2024
        </Text>

        {sections.map((section, index) => (
          <Section key={index} title={section.title} content={section.content} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TermsPrivacyScreen;
