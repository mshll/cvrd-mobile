import { View, Text, YStack, XStack, Button, Input, Circle, Switch, Slider } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState, useEffect } from 'react';
import { PlusIcon, ArrowPathIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { Platform, StatusBar, StyleSheet, Dimensions } from 'react-native';
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

const WINDOW_WIDTH = Dimensions.get('window').width;

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
  { id: 'transaction', label: 'Per Transaction', defaultValue: 1000, max: 5000 },
  { id: 'daily', label: 'Daily', defaultValue: 5000, max: 10000 },
  { id: 'weekly', label: 'Weekly', defaultValue: 10000, max: 25000 },
  { id: 'monthly', label: 'Monthly', defaultValue: 25000, max: 50000 },
  { id: 'total', label: 'Total', defaultValue: 25000, max: 50000 },
];

const CommonSettings = ({ cardName, setCardName, limits, setLimits }) => {
  const [selectedLimitType, setSelectedLimitType] = useState('transaction');
  const selectedOption = LIMIT_OPTIONS.find((opt) => opt.id === selectedLimitType);
  const insets = useSafeAreaInsets();

  const handleLimitChange = (value) => {
    setLimits((prev) => ({
      ...prev,
      [selectedLimitType]: value,
    }));
  };

  return (
    <YStack gap="$4" mt={insets.top - 30}>
      <YStack gap="$2">
        <Text
          color={Colors.dark.textSecondary}
          fontSize="$3"
          fontWeight="600"
          fontFamily="$heading"
        >
          Card Name
        </Text>
        <Input
          value={cardName}
          onChangeText={setCardName}
          placeholder="Enter card name"
          backgroundColor={Colors.dark.backgroundSecondary}
          borderWidth={0}
          color={Colors.dark.text}
          placeholderTextColor={Colors.dark.textTertiary}
          fontSize="$4"
          height={45}
          px="$4"
          fontWeight="700"
        />
      </YStack>

      <YStack gap="$2">
        <Text
          color={Colors.dark.textSecondary}
          fontSize="$3"
          fontWeight="600"
          fontFamily="$heading"
        >
          Spending Limits
        </Text>

        <XStack flexWrap="wrap" gap="$2">
          {LIMIT_OPTIONS.map((option) => (
            <Button
              key={option.id}
              backgroundColor={
                selectedLimitType === option.id
                  ? Colors.dark.primary
                  : Colors.dark.backgroundSecondary
              }
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => setSelectedLimitType(option.id)}
              size="$3"
              borderRadius={20}
            >
              <Text
                color={selectedLimitType === option.id ? 'white' : Colors.dark.text}
                fontSize="$3"
              >
                {option.label}
              </Text>
            </Button>
          ))}
        </XStack>

        <YStack gap="$2" mt="$2">
          <XStack jc="center" mb="$2">
            <Input
              value={`${limits[selectedLimitType]}`}
              onChangeText={(text) => {
                const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                handleLimitChange(Math.min(value, selectedOption.max));
              }}
              keyboardType="numeric"
              backgroundColor={Colors.dark.backgroundTertiary}
              borderWidth={0}
              color={Colors.dark.text}
              width={120}
              height={45}
              textAlign="center"
              fontSize="$5"
              fontWeight="600"
              placeholder="0"
              placeholderTextColor={Colors.dark.textTertiary}
              px="$4"
            />
          </XStack>
          <Slider
            defaultValue={[parseInt(selectedOption.defaultValue)]}
            min={0}
            max={selectedOption.max}
            step={100}
            value={[parseInt(limits[selectedLimitType])]}
            onValueChange={([value]) => handleLimitChange(value.toString())}
          >
            <Slider.Track backgroundColor={Colors.dark.backgroundTertiary} height={2}>
              <Slider.TrackActive backgroundColor={Colors.dark.primary} />
            </Slider.Track>
            <Slider.Thumb
              index={0}
              circular
              size="$2"
              backgroundColor={Colors.dark.primary}
              bordered
              borderColor={Colors.dark.background}
            />
          </Slider>
          <XStack jc="space-between" mt="$1">
            <Text color={Colors.dark.textSecondary} fontSize="$2">
              0KWD
            </Text>
            <Text color={Colors.dark.textSecondary} fontSize="$2">
              {selectedOption.max.toLocaleString()}KWD
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
};

const LocationSettings = ({ location, setLocation, radius, setRadius }) => {
  const [countryRadius, setCountryRadius] = useState(null);
  const [countryName, setCountryName] = useState('');

  const getLocationInfo = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response[0]) {
        const country = response[0].country;
        setCountryName(country);

        let approximateRadius;
        switch (country) {
          case 'Kuwait':
            approximateRadius = 100000;
            break;
          case 'United Arab Emirates':
            approximateRadius = 350000;
            break;
          case 'Saudi Arabia':
            approximateRadius = 1000000;
            break;
          default:
            approximateRadius = 200000;
        }
        setCountryRadius(approximateRadius);

        if (radius === RADIUS_OPTIONS[2].value) {
          setRadius(approximateRadius);
        }
      }
    } catch (error) {
      console.error('Error getting location info:', error);
    }
  };

  useEffect(() => {
    getLocationInfo(location.latitude, location.longitude);
  }, []);

  const handlePinDrag = (e) => {
    const newLocation = e.nativeEvent.coordinate;
    setLocation(newLocation);
    getLocationInfo(newLocation.latitude, newLocation.longitude);
  };

  return (
    <YStack gap="$4">
      <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Select Location
      </Text>
      <View
        height={200}
        backgroundColor={Colors.dark.backgroundSecondary}
        borderRadius={12}
        overflow="hidden"
      >
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          rotateEnabled={false}
        >
          <Marker
            coordinate={location}
            draggable
            onDragEnd={handlePinDrag}
            pinColor={Colors.dark.primary}
          />
          <MapCircle
            center={location}
            radius={radius}
            fillColor="rgba(214, 81, 91, 0.1)"
            strokeColor="rgba(214, 81, 91, 0.5)"
            strokeWidth={2}
          />
        </MapView>
      </View>
      <YStack gap="$2">
        <Text
          color={Colors.dark.textSecondary}
          fontSize="$3"
          fontWeight="600"
          fontFamily="$heading"
        >
          Radius
        </Text>
        <XStack flexWrap="wrap" gap="$2">
          {RADIUS_OPTIONS.map((option) => {
            const optionValue = option.value === null ? countryRadius : option.value;
            const isSelected = radius === optionValue;

            return (
              <Button
                key={option.label}
                backgroundColor={isSelected ? Colors.dark.primary : Colors.dark.backgroundSecondary}
                pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
                onPress={() => setRadius(optionValue)}
              >
                <YStack ai="center">
                  <Text color={isSelected ? 'white' : Colors.dark.text}>{option.label}</Text>
                  <Text color={isSelected ? 'white' : Colors.dark.textSecondary} fontSize="$2">
                    {option.label === 'Country' && countryName ? countryName : option.description}
                  </Text>
                </YStack>
              </Button>
            );
          })}
        </XStack>
      </YStack>
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
        borderWidth={0}
        color={Colors.dark.text}
        placeholderTextColor={Colors.dark.textTertiary}
      />
      <View
        height={245}
        backgroundColor={Colors.dark.backgroundSecondary}
        borderRadius={12}
        overflow="hidden"
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
    transaction: '1000',
    daily: '5000',
    weekly: '10000',
    monthly: '25000',
    total: '25000',
  });

  // Type-specific state
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [location, setLocation] = useState({
    latitude: 29.3759,
    longitude: 47.9774,
  });
  const [radius, setRadius] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNext = () => {
    const cardData = {
      name: cardName,
      limits: {
        transaction: parseInt(limits.transaction),
        daily: parseInt(limits.daily),
        weekly: parseInt(limits.weekly),
        monthly: parseInt(limits.monthly),
        total: parseInt(limits.total),
      },
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
      <View style={styles.container}>
        {/* Common Settings */}
        <CommonSettings
          cardName={cardName}
          setCardName={setCardName}
          limits={limits}
          setLimits={setLimits}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'column',
  },
});

export default CardConfigComponent;
