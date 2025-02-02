import { View, Text, YStack, XStack, Button, Input, Circle, Switch, Slider } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, ArrowPathIcon, MapPinIcon, ChevronLeftIcon, QuestionMarkCircleIcon, PencilIcon } from 'react-native-heroicons/solid';
import { Platform, StatusBar, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import CardComponent from '@/components/CardComponent';
import { CARD_HEIGHT } from '@/utils/cardUtils';
import { ScrollView } from 'react-native-gesture-handler';
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import BottomSheet from '@/components/BottomSheet';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MAP_HEIGHT = 200;

// Add radius constants
const MIN_RADIUS = 0.2; // in km
const MAX_RADIUS = 100; // in km
const DEFAULT_RADIUS = 0.5; // in km

const CATEGORIES = [
  { id: '1', name: 'Entertainment', emoji: '🎬' },
  { id: '2', name: 'Shopping', emoji: '🛍️' },
  { id: '3', name: 'Travel', emoji: '✈️' },
  { id: '4', name: 'Food', emoji: '🍔' },
  { id: '5', name: 'Transport', emoji: '🚌' },
  { id: '6', name: 'Health', emoji: '🏥' },
  { id: '7', name: 'Education', emoji: '📚' },
  { id: '8', name: 'Utilities', emoji: '🔌' },
  { id: '9', name: 'Other', emoji: '🛠️' },
];

const RADIUS_OPTIONS = [
  { label: 'Neighborhood', value: 1000, description: '1km radius' },
  { label: 'District', value: 5000, description: '5km radius' },
  { label: 'Country', value: null, description: 'Entire country' },
];

const LIMIT_OPTIONS = [
  { id: 'per_transaction', label: 'Per Transaction', defaultValue: 1000, max: 200 },
  { id: 'per_day', label: 'Per Day', defaultValue: 5000, max: 500 },
  { id: 'per_week', label: 'Per Week', defaultValue: 10000, max: 2000 },
  { id: 'per_month', label: 'Per Month', defaultValue: 25000, max: 8000 },
  { id: 'per_year', label: 'Per Year', defaultValue: 50000, max: 100000 },
  { id: 'total', label: 'Total', defaultValue: 100000, max: 200000 },
  { id: 'no_limit', label: 'No Limit', defaultValue: null, max: null },
];

const CommonSettings = ({ cardName, setCardName, limits, setLimits, selectedLimits, setSelectedLimits }) => {
  const [selectedLimitType, setSelectedLimitType] = useState('per_transaction');
  const selectedOption = LIMIT_OPTIONS.find((opt) => opt.id === selectedLimitType);
  const insets = useSafeAreaInsets();

  const handleLimitChange = (value) => {
    if (selectedLimitType === 'no_limit') {
      setLimits((prev) => ({
        ...prev,
        [selectedLimitType]: null,
      }));
    } else {
      setLimits((prev) => ({
        ...prev,
        [selectedLimitType]: value,
      }));
    }
    // Add this limit type to the set of selected limits
    setSelectedLimits(prev => new Set([...prev, selectedLimitType]));
  };

  return (
    <YStack gap="$5" mt={insets.top - 30}>
      {/* Card Name Input */}
      <YStack gap="$3">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Card Name
        </Text>
        <Input
          value={cardName}
          onChangeText={setCardName}
          placeholder="Enter card name"
          backgroundColor={Colors.dark.backgroundSecondary}
          borderWidth={1}
          borderColor={Colors.dark.border}
          color={Colors.dark.text}
          placeholderTextColor={Colors.dark.textTertiary}
          fontSize="$4"
          height={45}
          px="$4"
          fontWeight="700"
          br={12}
        />
      </YStack>

      {/* Spending Limits */}
      <YStack gap="$3">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Spending Limits
        </Text>

        <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.dark.backgroundSecondary, borderWidth: 1, borderColor: Colors.dark.border, marginBottom:16 }}>
          <YStack p="$4" gap="$4">
            {/* Amount Input */}
            <XStack 
              backgroundColor={Colors.dark.backgroundTertiary} 
              br={12} 
              height={70} 
              ai="center" 
              px="$4"
              opacity={selectedLimitType === 'no_limit' ? 0.5 : 1}
            >
              <Text color={Colors.dark.text} fontSize="$8" fontWeight="700" fontFamily="$archivoBlack" mr="$2">
                KD
              </Text>
              <Input
                value={selectedLimitType === 'no_limit' ? '' : limits[selectedLimitType] === '0' ? '' : limits[selectedLimitType]}
                onChangeText={(text) => {
                  if (selectedLimitType !== 'no_limit') {
                    const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                    handleLimitChange(Math.min(value, selectedOption.max).toString());
                  }
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
                backgroundColor="transparent"
                borderWidth={0}
                color={Colors.dark.text}
                placeholderTextColor={Colors.dark.textTertiary}
                fontSize="$8"
                fontFamily="$archivoBlack"
                p={0}
                fontWeight="700"
                textAlign="left"
                flex={1}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                editable={selectedLimitType !== 'no_limit'}
              />
            </XStack>

            {/* Period Selection */}
            <XStack flexWrap="wrap" gap="$1">
              {LIMIT_OPTIONS.map((option, index) => {
                const totalOptions = LIMIT_OPTIONS.length;
                const rowSize = 2;
                const totalRows = Math.ceil(totalOptions / rowSize);
                const currentRow = Math.floor(index / rowSize) + 1;
                
                const isFirstRow = currentRow === 1;
                const isLastRow = currentRow === totalRows;
                const isFirstInRow = index % rowSize === 0;
                const isLastInRow = index % rowSize === 1 || index === totalOptions - 1;

                const isSelected = selectedLimitType === option.id;
                const hasValue = selectedLimits.has(option.id) && 
                  (option.id === 'no_limit' || parseInt(limits[option.id]) > 0);

                let borderRadius = {
                  borderTopLeftRadius: isFirstRow && isFirstInRow ? 12 : 0,
                  borderTopRightRadius: isFirstRow && isLastInRow ? 12 : 0,
                  borderBottomLeftRadius: isLastRow && isFirstInRow ? 12 : 0,
                  borderBottomRightRadius: isLastRow && isLastInRow ? 12 : 0,
                };

                return (
                  <Button
                    key={option.id}
                    backgroundColor={
                      isSelected ? Colors.dark.primary : 
                      hasValue ? Colors.dark.primaryDark : Colors.dark.backgroundTertiary
                    }
                    pressStyle={{
                      backgroundColor:
                        isSelected ? Colors.dark.primaryDark : Colors.dark.backgroundTertiary,
                    }}
                    onPress={() => {
                      setSelectedLimitType(option.id);
                      if (option.id === 'no_limit') {
                        handleLimitChange(null);
                      }
                    }}
                    flex={1}
                    height={50}
                    minWidth="48%"
                    {...borderRadius}
                  >
                    <Text
                      color={isSelected || hasValue ? 'white' : Colors.dark.text}
                      fontSize="$3"
                      fontWeight="600"
                    >
                      {option.label}
                    </Text>
                  </Button>
                );
              })}
            </XStack>

            {/* Max Amount Display */}
            {selectedLimitType !== 'no_limit' && (
              <Text color={Colors.dark.textSecondary} fontSize="$3">
                Maximum amount: {selectedOption.max.toLocaleString()} KWD
              </Text>
            )}
          </YStack>
        </View>
      </YStack>
    </YStack>
  );
};

const LocationSettings = ({ location, setLocation, radius, setRadius }) => {
  const [countryRadius, setCountryRadius] = useState(null);
  const [countryName, setCountryName] = useState('');
  const [address, setAddress] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const navigation = useNavigation();

  const getLocationInfo = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response[0]) {
        const location = response[0];
        setCountryName(location.country);
        
        // Construct address string
        const addressParts = [
          location.street,
          location.district,
          location.city,
          location.region,
        ].filter(Boolean);
        
        setAddress(addressParts.join(', '));
      }
    } catch (error) {
      console.error('Error getting location info:', error);
    }
  };

  useEffect(() => {
    getLocationInfo(location.latitude, location.longitude);
  }, [location]);

  const handleMaximizeMap = () => {
    navigation.navigate(Paths.EDIT_LOCATION, {
      initialLocation: location,
      initialRadius: radius,
      onSave: (newLocation, newRadius) => {
        setLocation(newLocation);
        setRadius(newRadius);
      },
      cardColor: 'primary'
    });
  };

  return (
    <YStack gap="$4">
      <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Select Location
      </Text>

      <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.dark.backgroundSecondary }}>
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
            <Marker
              coordinate={location}
              pinColor={Colors.dark.primary}
            />
            <MapCircle
              center={location}
              radius={radius * 1000}
              fillColor={`${Colors.dark.primary}20`}
              strokeColor={Colors.dark.primary}
              strokeWidth={2}
            />
          </MapView>

          {/* Top right buttons */}
          <XStack position="absolute" top={12} left={12} gap="$2">
            <Button
              size="$3"
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={handleMaximizeMap}
              borderWidth={1}
              borderColor={Colors.dark.border}
              br={8}
              px="$3"
            >
              <Text color={Colors.dark.text} fontSize="$2" fontWeight="600">
                Edit
              </Text>
            </Button>
          </XStack>
          <XStack position="absolute" top={12} right={12} gap="$2">
          <Button
              size="$3"
              circular
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => setShowHelp(true)}
              borderWidth={1}
              borderColor={Colors.dark.border}
              icon={<QuestionMarkCircleIcon size={20} color={Colors.dark.text} />}
            />
          </XStack>
        </View>

        {/* Location Info */}
        <YStack px={12} py={12} gap={8}>
          {address ? (
            <Text color={Colors.dark.text} fontSize="$3" numberOfLines={2}>
              {address}
            </Text>
          ) : (
            <Text color={Colors.dark.textSecondary} fontSize="$3">
              Loading address...
            </Text>
          )}
          
          {/* Radius Display */}
          <XStack backgroundColor={Colors.dark.backgroundTertiary} px="$3" py="$2" br={8} gap="$2" ai="center">
            <Text color={Colors.dark.text} fontSize="$4" fontFamily="$archivoBlack">
              {radius.toFixed(1)} km
            </Text>
          </XStack>
        </YStack>
      </View>

      {/* Help Sheet */}
      <BottomSheet isOpen={showHelp} onClose={() => setShowHelp(false)}>
        <YStack gap="$4" px="$4" pt="$2" pb="$6">
          <Text color={Colors.dark.text} fontSize="$6" fontFamily="$archivoBlack">
            How to Edit Location
          </Text>
          <YStack gap="$3">
            <XStack gap="$2" ai="center">
              <View w={8} h={8} br={4} bg={Colors.dark.primary} />
              <Text color={Colors.dark.text} fontSize="$4">
                Move Pin
              </Text>
            </XStack>
            <Text color={Colors.dark.textSecondary} fontSize="$3" pl={20}>
              Press and hold anywhere on the map to move the pin, or drag the existing pin
            </Text>

            <XStack gap="$2" ai="center">
              <View w={8} h={8} br={4} bg={Colors.dark.primary} />
              <Text color={Colors.dark.text} fontSize="$4">
                Adjust Radius
              </Text>
            </XStack>
            <Text color={Colors.dark.textSecondary} fontSize="$3" pl={20}>
              Use the slider to adjust the radius, or tap the radius display at the top to enter a specific value
              between {MIN_RADIUS} and {MAX_RADIUS} km
            </Text>
          </YStack>
        </YStack>
      </BottomSheet>
    </YStack>
  );
};

const CategorySettings = ({ selectedCategory, setSelectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCategories = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <YStack gap="$4">
      <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Select Category
      </Text>
      <Input
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search categories..."
        backgroundColor={Colors.dark.backgroundSecondary}
        borderWidth={1}
        borderColor={Colors.dark.border}
        color={Colors.dark.text}
        placeholderTextColor={Colors.dark.textTertiary}
        br={12}
        height={45}
        px="$4"
      />
      <View
        height={245}
        backgroundColor={Colors.dark.backgroundSecondary}
        borderRadius={12}
        overflow="hidden"
        borderWidth={1}
        borderColor={Colors.dark.border}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 12,
            gap: 8,
          }}
        >
          {filteredCategories.map((category) => (
            <Button
              key={category.id}
              backgroundColor={
                selectedCategory?.id === category.id
                  ? Colors.dark.primary
                  : Colors.dark.backgroundTertiary
              }
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => setSelectedCategory(category)}
              mb="$2"
              borderWidth={1}
              borderColor={Colors.dark.border}
            >
              <XStack ai="center" gap="$2">
                <Text fontSize={20}>{category.emoji}</Text>
                <Text color={selectedCategory?.id === category.id ? 'white' : Colors.dark.text}>
                  {category.name}
                </Text>
              </XStack>
            </Button>
          ))}
        </ScrollView>
      </View>
    </YStack>
  );
};

const CardConfigComponent = ({ cardType, initialData, onBack, onNext }) => {
  const insets = useSafeAreaInsets();

  // Common state
  const [cardName, setCardName] = useState(initialData?.label || '');
  const [limits, setLimits] = useState({
    per_transaction: '0',
    per_day: '0',
    per_week: '0',
    per_month: '0',
    per_year: '0',
    total: '0',
  });
  
  // Keep track of which limits have been selected/modified
  const [selectedLimits, setSelectedLimits] = useState(new Set());

  // Type-specific state
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [location, setLocation] = useState({
    latitude: 29.3759,
    longitude: 47.9774,
  });
  const [radius, setRadius] = useState(0.5);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNext = () => {
    // Convert limits to numbers and filter out unselected ones
    const selectedLimitsData = {};
    
    // Process each limit
    Object.entries(limits).forEach(([key, value]) => {
      if (selectedLimits.has(key)) {
        if (key === 'no_limit') {
          selectedLimitsData[key] = null;
        } else {
          const numValue = parseInt(value);
          if (numValue > 0) {
            selectedLimitsData[key] = numValue;
          }
        }
      }
    });

    const cardData = {
      name: cardName,
      limits: selectedLimitsData,
    };

    // Add type-specific data
    if (cardType === 'Merchant') {
      cardData.merchant = selectedMerchant;
    } else if (cardType === 'Location') {
      cardData.location = location;
      cardData.radius = radius;
    } else if (cardType === 'Category') {
      cardData.category = selectedCategory;
    }

    onNext(cardData);
  };

  // Render type-specific settings based on card type
  const renderTypeSpecificSettings = () => {
    switch (cardType) {
      case 'Location':
        return (
          <LocationSettings
            location={location}
            setLocation={setLocation}
            radius={radius}
            setRadius={setRadius}
          />
        );
      case 'Category':
        return (
          <CategorySettings
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View f={1} backgroundColor={Colors.dark.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Common Settings */}
        <CommonSettings
          cardName={cardName}
          setCardName={setCardName}
          limits={limits}
          setLimits={setLimits}
          selectedLimits={selectedLimits}
          setSelectedLimits={setSelectedLimits}
        />

        {/* Type-specific Settings */}
        {renderTypeSpecificSettings()}

        {/* Bottom Buttons */}
        <XStack
          width="100%"
          gap="$12"
          borderTopWidth={1}
          borderTopColor={`${Colors.dark.border}40`}
          pt="$4"
          mt="auto"
          mb={insets.bottom + 50}
          jc="space-between"
        >
          <Button
            f={1}
            backgroundColor={Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={onBack}
            size="$5"
            borderRadius={15}
            borderWidth={1}
            borderColor={Colors.dark.border}
          >
            <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily="$archivo">
              Back
            </Text>
          </Button>
          <Button
            f={1}
            backgroundColor={Colors.dark.primary}
            pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
            onPress={handleNext}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              Next
            </Text>
          </Button>
        </XStack>
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
