import { View, Text, YStack, XStack, Button, Input, Circle, Switch, Slider } from 'tamagui';
import { Colors, useColors } from '@/context/ColorSchemeContext';
import { useState, useEffect, useCallback } from 'react';
import {
  PlusIcon,
  ArrowPathIcon,
  MapPinIcon,
  ChevronLeftIcon,
  QuestionMarkCircleIcon,
  PencilIcon,
  PaintBrushIcon,
  FaceSmileIcon,
  FireIcon,
  TagIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ChevronDownIcon,
  BanknotesIcon,
} from 'react-native-heroicons/solid';
import { Platform, StatusBar, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import EmojiPicker from 'rn-emoji-keyboard';
import CardComponent from '@/components/CardComponent';
import { CARD_HEIGHT, CARD_WIDTH } from '@/utils/cardUtils';
import { ScrollView } from 'react-native-gesture-handler';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import BottomSheet from '@/components/BottomSheet';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import SpendLimitMenu from '@/components/SpendLimitMenu';
import { CARD_DEFAULTS } from '@/api/cards';
import { formatCurrency } from '@/utils/utils';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MAP_HEIGHT = 200;

// Add radius constants
const MIN_RADIUS = 0.2; // in km
const MAX_RADIUS = 100; // in km
const DEFAULT_RADIUS = 0.5; // in km

const CATEGORIES = [
  { id: '1', name: 'Entertainment', emoji: '🎬', description: 'Movies, streaming, and events' },
  { id: '2', name: 'Shopping', emoji: '🛍️', description: 'Retail stores and online shopping' },
  { id: '3', name: 'Travel', emoji: '✈️', description: 'Airlines, hotels, and transportation' },
  { id: '4', name: 'Food', emoji: '🍔', description: 'Restaurants and food delivery' },
  { id: '5', name: 'Transport', emoji: '🚌', description: 'Public transport and ride-sharing' },
  { id: '6', name: 'Health', emoji: '🏥', description: 'Medical services and pharmacies' },
  { id: '7', name: 'Education', emoji: '📚', description: 'Schools, courses, and learning materials' },
  { id: '8', name: 'Utilities', emoji: '🔌', description: 'Bills and utility payments' },
  { id: '9', name: 'Other', emoji: '🛠️', description: 'Miscellaneous expenses' },
];

const RADIUS_OPTIONS = [
  { label: 'Neighborhood', value: 1000, description: '1km radius' },
  { label: 'District', value: 5000, description: '5km radius' },
  { label: 'Country', value: null, description: 'Entire country' },
];

const CommonSettings = ({ cardName, setCardName, limits, setLimits, error }) => {
  const colors = useColors();
  const [showLimitsSheet, setShowLimitsSheet] = useState(false);

  // Helper to get active limit text
  const getActiveLimitText = () => {
    const activeLimits = Object.entries(limits).filter(([_, value]) => value !== null && value > 0);
    if (activeLimits.length === 0) return 'No limits set';
    const [type, value] = activeLimits[0];
    return `${formatCurrency(value)} ${type.replace('_', ' ')}`;
  };

  return (
    <YStack gap="$5">
      {/* Card Name Input */}
      <YStack gap="$3">
        <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Card Name
        </Text>
        <Input
          value={cardName}
          onChangeText={setCardName}
          placeholder="Enter card name"
          backgroundColor={colors.backgroundSecondary}
          borderWidth={1}
          borderColor={error ? colors.primary : colors.border}
          color={colors.text}
          placeholderTextColor={colors.textTertiary}
          fontSize="$4"
          height={45}
          px="$4"
          fontWeight="700"
          br={12}
        />
        {error && (
          <Text color={colors.primary} fontSize="$2">
            {error}
          </Text>
        )}
      </YStack>

      {/* Spending Limits Button */}
      <YStack gap="$3">
        <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Spending Limits
        </Text>
        <Button
          onPress={() => setShowLimitsSheet(true)}
          backgroundColor={colors.backgroundSecondary}
          pressStyle={{ backgroundColor: colors.backgroundTertiary }}
          borderWidth={1}
          borderColor={colors.border}
          br={12}
          p="$4"
          height="auto"
        >
          <YStack gap="$2">
            <XStack ai="center" gap="$2">
              <BanknotesIcon size={20} color={colors.text} />
              <Text color={colors.text} fontSize="$4" fontWeight="600">
                {getActiveLimitText()}
              </Text>
            </XStack>
            <Text color={colors.textSecondary} fontSize="$3">
              Set spending limits for your card to control expenses
            </Text>
          </YStack>
        </Button>
      </YStack>

      {/* Spending Limits Sheet */}
      <BottomSheet isOpen={showLimitsSheet} onClose={() => setShowLimitsSheet(false)}>
        <SpendLimitMenu
          card={limits}
          onSave={(updates) => {
            setLimits(updates);
            setShowLimitsSheet(false);
          }}
          darkButtons
          showSaveButton
        />
      </BottomSheet>
    </YStack>
  );
};

const LocationSettings = ({ location, setLocation, radius, setRadius }) => {
  const [countryRadius, setCountryRadius] = useState(null);
  const [countryName, setCountryName] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const navigation = useNavigation();
  const colors = useColors();

  const getLocationInfo = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response[0]) {
        const locationInfo = response[0];
        setCountryName(locationInfo.country);

        // Create formatted address with just street and country
        const formattedAddress = [locationInfo.street, locationInfo.country].filter(Boolean).join(', ');

        // Update the location object with the address
        setLocation((prev) => ({
          ...prev,
          latitude,
          longitude,
          address: formattedAddress,
          country: locationInfo.country,
        }));
      }
    } catch (error) {
      console.error('Error getting location info:', error);
    }
  };

  useEffect(() => {
    getLocationInfo(location.latitude, location.longitude);
  }, [location.latitude, location.longitude]);

  const handleMaximizeMap = () => {
    navigation.navigate(Paths.EDIT_LOCATION, {
      initialLocation: location,
      initialRadius: radius,
      onSave: (newLocation, newRadius) => {
        setLocation(newLocation);
        setRadius(newRadius);
      },
      cardColor: 'primary',
    });
  };

  return (
    <YStack gap="$4">
      <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Select Location
      </Text>

      <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: colors.backgroundSecondary }}>
        <View style={{ height: MAP_HEIGHT }}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={location} pinColor={colors.primary} />
            <MapCircle
              center={location}
              radius={radius * 1000}
              fillColor={`${colors.primary}20`}
              strokeColor={colors.primary}
              strokeWidth={2}
            />
          </MapView>

          {/* Top right buttons */}
          <XStack position="absolute" top={12} right={12} gap="$2">
            <Button
              size="$2"
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={handleMaximizeMap}
              borderWidth={1}
              borderColor={colors.border}
              br={8}
              px="$3"
            >
              <Text color={colors.text} fontSize="$2" fontWeight="600">
                Edit
              </Text>
            </Button>
          </XStack>
        </View>

        {/* Location Info */}
        <YStack px={12} py={12} gap={8} borderTopWidth={1} borderTopColor={colors.border}>
          <XStack jc="space-between" ai="center">
            <XStack ai="center" gap="$2">
              <Text color={colors.text} fontSize="$4" fontWeight="600">
                {location.address ? (
                  <Text color={colors.text} fontSize="$3" numberOfLines={2}>
                    {location.address}
                  </Text>
                ) : (
                  <Text color={colors.textSecondary} fontSize="$3">
                    Loading address...
                  </Text>
                )}
              </Text>
            </XStack>
          </XStack>

          <Text color={colors.textSecondary} fontSize="$3" fontFamily="$mono">
            {radius.toFixed(1)} km radius
          </Text>
        </YStack>
      </View>

      {/* Help Sheet */}
      <BottomSheet isOpen={showHelp} onClose={() => setShowHelp(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            How to Edit Location
          </Text>
          <YStack gap="$3">
            <XStack gap="$2" ai="center">
              <View w={8} h={8} br={4} bg={colors.primary} />
              <Text color={colors.text} fontSize="$4">
                Move Pin
              </Text>
            </XStack>
            <Text color={colors.textSecondary} fontSize="$3" pl={20}>
              Press and hold anywhere on the map to move the pin, or drag the existing pin
            </Text>

            <XStack gap="$2" ai="center">
              <View w={8} h={8} br={4} bg={colors.primary} />
              <Text color={colors.text} fontSize="$4">
                Adjust Radius
              </Text>
            </XStack>
            <Text color={colors.textSecondary} fontSize="$3" pl={20}>
              Use the slider to adjust the radius, or tap the radius display at the top to enter a specific value
              between {MIN_RADIUS} and {MAX_RADIUS} km
            </Text>
          </YStack>
        </YStack>
      </BottomSheet>
    </YStack>
  );
};

const CategorySettings = ({ selectedCategory, setSelectedCategory, error }) => {
  const colors = useColors();
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIES.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <YStack gap="$4">
      <Text color={colors.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Category
      </Text>
      <Button
        onPress={() => setShowCategorySheet(true)}
        backgroundColor={colors.backgroundSecondary}
        pressStyle={{ backgroundColor: colors.backgroundTertiary }}
        borderWidth={1}
        borderColor={error ? colors.primary : colors.border}
        br={12}
        p="$4"
        height="auto"
      >
        <YStack gap="$2">
          <XStack ai="center" gap="$2">
            {selectedCategory ? (
              <>
                <Text fontSize={20}>{selectedCategory.emoji}</Text>
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  {selectedCategory.name}
                </Text>
              </>
            ) : (
              <>
                <TagIcon size={20} color={colors.text} />
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  Select a category
                </Text>
              </>
            )}
          </XStack>
          <Text color={colors.textSecondary} fontSize="$3">
            Choose a spending category to restrict card usage
          </Text>
        </YStack>
      </Button>
      {error && (
        <Text color={colors.primary} fontSize="$2">
          {error}
        </Text>
      )}

      {/* Category Selection Sheet */}
      <BottomSheet isOpen={showCategorySheet} onClose={() => setShowCategorySheet(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Select Category
          </Text>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search categories..."
            backgroundColor={colors.backgroundSecondary}
            borderWidth={1}
            borderColor={colors.border}
            color={colors.text}
            placeholderTextColor={colors.textTertiary}
            br={12}
            height={45}
            px="$4"
          />
          <YStack gap="$2" maxHeight={400}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: 8,
              }}
            >
              {filteredCategories.map((category) => (
                <Button
                  key={category.id}
                  backgroundColor={selectedCategory?.id === category.id ? colors.primary : colors.backgroundTertiary}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategorySheet(false);
                  }}
                  borderWidth={1}
                  borderColor={colors.border}
                  br={12}
                  height={60}
                >
                  <XStack f={1} ai="center" jc="flex-start" gap="$3" px="$2">
                    <Text fontSize={20}>{category.emoji}</Text>
                    <Text
                      color={selectedCategory?.id === category.id ? 'white' : colors.text}
                      fontSize="$4"
                      fontWeight="600"
                    >
                      {category.name}
                    </Text>
                  </XStack>
                </Button>
              ))}
            </ScrollView>
          </YStack>
        </YStack>
      </BottomSheet>
    </YStack>
  );
};

const getCardTypeInfo = (type) => {
  switch (type) {
    case 'BURNER':
      return {
        title: 'Burner Card',
        description: 'Create a single-use or time-limited card',
        icon: FireIcon,
      };
    case 'CATEGORY_LOCKED':
      return {
        title: 'Category Card',
        description: 'Lock your card to specific spending categories',
        icon: TagIcon,
      };
    case 'MERCHANT_LOCKED':
      return {
        title: 'Merchant Card',
        description: 'Lock your card to specific merchants',
        icon: BuildingStorefrontIcon,
      };
    case 'LOCATION_LOCKED':
      return {
        title: 'Location Card',
        description: 'Lock your card to specific locations',
        icon: MapPinIcon,
      };
    default:
      return {
        title: 'New Card',
        description: 'Configure your card settings',
        icon: CreditCardIcon,
      };
  }
};

const CardConfigComponent = ({ cardType, initialData, onBack, onNext }) => {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const cardTypeInfo = getCardTypeInfo(cardType);
  const Icon = cardTypeInfo.icon;

  // Animation values
  const cardScale = useSharedValue(0.8);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // Animate on mount
  useEffect(() => {
    cardScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
    contentOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      })
    );
    contentTranslateY.value = withDelay(
      200,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, []);

  // Animation styles
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  // Common state
  const [cardName, setCardName] = useState('');
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [limits, setLimits] = useState({
    per_transaction: null,
    per_day: null,
    per_week: null,
    per_month: null,
    per_year: null,
    total: null,
  });

  // Type-specific state
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [location, setLocation] = useState({
    latitude: 29.3759,
    longitude: 47.9774,
  });
  const [radius, setRadius] = useState(0.5);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const validateForm = () => {
    let isValid = true;

    if (!cardName.trim()) {
      setNameError('Card name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (cardType === 'CATEGORY_LOCKED' && !selectedCategory) {
      setCategoryError('Please select a category');
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    // Animate out
    cardScale.value = withTiming(1.1, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    contentOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
    contentTranslateY.value = withTiming(-20, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });

    // Delay the actual navigation to allow animations to complete
    setTimeout(() => {
      const cardData = {
        name: cardName,
        limits,
        cardIcon: CARD_DEFAULTS[cardType]?.icon || '💳',
        cardColor: CARD_DEFAULTS[cardType]?.color || Colors.cards.blue,
      };

      // Add type-specific data
      if (cardType === 'MERCHANT_LOCKED') {
        cardData.merchant = selectedMerchant;
      } else if (cardType === 'LOCATION_LOCKED') {
        cardData.location = {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          country: location.country,
        };
        cardData.radius = radius;
      } else if (cardType === 'CATEGORY_LOCKED') {
        cardData.category = selectedCategory;
      }

      onNext(cardData);
    }, 300);
  };

  const handleBack = () => {
    // Animate out
    cardScale.value = withTiming(0.8, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    contentOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
    contentTranslateY.value = withTiming(50, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });

    // Delay the actual navigation to allow animations to complete
    setTimeout(onBack, 300);
  };

  return (
    <View f={1} backgroundColor={colors.background} pt={insets.top - 20}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <Animated.View style={[{ flex: 1 }, contentStyle]}>
          <YStack gap="$2" pb="$6">
            <XStack ai="flex-start" gap="$3">
              <View backgroundColor={`${colors.primary}15`} p="$3" br={12}>
                <Icon size={24} color={colors.primary} />
              </View>
              <YStack f={1}>
                <Text color={colors.text} fontSize="$7" fontFamily="$archivoBlack">
                  {cardTypeInfo.title}
                </Text>
                <Text color={colors.textSecondary} fontSize="$3" numberOfLines={2}>
                  {cardTypeInfo.description}
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Settings Sections */}
          <YStack gap="$4">
            {/* Common Settings */}
            <CommonSettings
              cardName={cardName}
              setCardName={setCardName}
              limits={limits}
              setLimits={setLimits}
              error={nameError}
            />

            {/* Type-specific Settings */}
            {cardType === 'LOCATION_LOCKED' && (
              <LocationSettings location={location} setLocation={setLocation} radius={radius} setRadius={setRadius} />
            )}
            {cardType === 'CATEGORY_LOCKED' && (
              <CategorySettings
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                error={categoryError}
              />
            )}
          </YStack>
        </Animated.View>

        {/* Bottom Buttons */}
        <Animated.View style={contentStyle}>
          <XStack
            width="100%"
            gap="$4"
            borderTopWidth={1}
            borderTopColor={`${colors.border}40`}
            pt="$4"
            mt="auto"
            mb={insets.bottom + 50}
            jc="space-between"
          >
            <Button
              flex={1}
              backgroundColor={colors.backgroundSecondary}
              pressStyle={{ backgroundColor: colors.backgroundTertiary }}
              onPress={handleBack}
              size="$5"
              borderRadius={15}
              borderWidth={1}
              borderColor={colors.border}
            >
              <Text color={colors.text} fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Back
              </Text>
            </Button>
            <Button
              flex={1}
              backgroundColor={colors.primary}
              pressStyle={{ backgroundColor: colors.primaryDark }}
              onPress={handleNext}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Next
              </Text>
            </Button>
          </XStack>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
});

export default CardConfigComponent;
