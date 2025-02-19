import { Colors, useColors } from '@/context/ColorSchemeContext';
import { View, Text, YStack, XStack, Button, ScrollView } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
} from 'react-native-heroicons/outline';

const FAQItem = ({ question, answer }) => {
  const colors = useColors();
  return (
    <YStack
      backgroundColor={colors.backgroundSecondary}
      p="$4"
      br={12}
      borderWidth={1}
      borderColor={colors.border}
      gap="$2"
      mb="$3"
    >
      <Text color={colors.text} fontSize="$4" fontWeight="600">
        {question}
      </Text>
      <Text color={colors.textSecondary} fontSize="$3" lineHeight={20}>
        {answer}
      </Text>
    </YStack>
  );
};

const ContactOption = ({ icon: Icon, title, description, onPress }) => {
  const colors = useColors();
  return (
    <Button
      backgroundColor={colors.backgroundSecondary}
      pressStyle={{ backgroundColor: colors.backgroundTertiary }}
      onPress={onPress}
      height="$6"
      br={12}
      borderWidth={1}
      borderColor={colors.border}
      mb="$3"
    >
      <XStack ai="center" gap="$3">
        <View backgroundColor={`${colors.primary}15`} p="$2" br={8}>
          <Icon size={20} color={colors.primary} />
        </View>
        <YStack f={1} gap="$1">
          <Text color={colors.text} fontSize="$4" fontWeight="600">
            {title}
          </Text>
          <Text color={colors.textSecondary} fontSize="$3">
            {description}
          </Text>
        </YStack>
      </XStack>
    </Button>
  );
};

const HelpCenterScreen = () => {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const faqs = [
    {
      question: 'How do I create a new card?',
      answer:
        'Tap the "+" button in the bottom navigation bar to create a new card. Choose from different card types like burner, merchant-locked, or location-locked cards. Follow the setup wizard to configure your card settings and limits.',
    },
    {
      question: 'What are the different types of cards?',
      answer:
        'We offer several card types: Burner Cards (single-use), Merchant-Locked Cards (specific merchant only), Category-Locked Cards (specific category only, Premium), and Location-Locked Cards (specific area only, Premium). Each type provides different levels of control and security.',
    },
    {
      question: 'What is a burner card?',
      answer:
        'A burner card is a single-use virtual card that automatically deactivates after one transaction. Perfect for free trials, one-time purchases, or when you want extra security. Once used, the card cannot be used again, protecting you from recurring charges.',
    },
    {
      question: 'How do I upgrade to Premium?',
      answer:
        'Go to your Profile, tap "Your Plan", and select the Premium option. Premium gives you access to advanced features like category and location-locked cards, higher spending limits, and more cards per month. You can cancel or modify your subscription at any time.',
    },
    {
      question: 'How do spending limits work?',
      answer:
        'Each card can have daily, monthly, or per-transaction spending limits. Premium users get higher limits. You can view and manage these limits in your card settings. The app tracks your spending and automatically declines transactions that would exceed your limits.',
    },
    {
      question: 'What should I do if my card is declined?',
      answer:
        'Cards may be declined if they exceed spending limits, are used outside their designated location/merchant, or if there are suspicious activities. Check your card settings and limits first. If the issue persists, contact our support team for assistance.',
    },
    {
      question: 'How do I pause or close a card?',
      answer:
        'Open the card details by tapping on any card, then use the action buttons at the top. You can pause a card temporarily (and unpause later) or close it permanently. Closed cards cannot be reactivated for security reasons.',
    },
    {
      question: 'Is my card information secure?',
      answer:
        'Yes, we use bank-grade encryption and security measures. Card numbers are tokenized, and sensitive data is never stored on your device. We also offer biometric authentication and real-time transaction monitoring.',
    },
    {
      question: 'How do I connect my bank account?',
      answer:
        'Go to Profile and look for the bank connection section. We currently support Boubyan Bank. Tap "Connect" and follow the secure authentication process. Your bank credentials are never stored in our app.',
    },
    {
      question: 'What are merchant-locked cards?',
      answer:
        'Merchant-locked cards can only be used with specific merchants (e.g., Amazon, Netflix). They provide extra security by preventing unauthorized use at other merchants. Perfect for subscriptions or regular shopping at specific stores.',
    },
    {
      question: 'How do location-locked cards work? (Premium)',
      answer:
        'Location-locked cards only work within a specified geographic area that you define. Great for travel cards or controlling where purchases can be made. You can set the radius and location in the card settings.',
    },
    {
      question: 'Can I share my cards with others?',
      answer:
        'Currently, card sharing is not supported for security reasons. Each card should only be used by the account holder. We recommend creating separate cards for different users.',
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
          <Text color={colors.text} fontSize="$6" fontFamily="Archivo-Black" fontWeight="900">
            Help Center
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
        {/* Contact Options */}
        <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" mb="$4">
          Contact Us
        </Text>
        <ContactOption
          icon={ChatBubbleLeftRightIcon}
          title="Live Chat"
          description="Chat with our support team"
          onPress={() => {}}
        />
        <ContactOption icon={EnvelopeIcon} title="Email Support" description="support@cvrd.com" onPress={() => {}} />

        {/* FAQs */}
        <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" mb="$4" mt="$4">
          Frequently Asked Questions
        </Text>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;
