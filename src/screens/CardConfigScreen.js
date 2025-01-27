import { View, Text, YStack, XStack, Button, Input, Circle, Switch } from 'tamagui';
import { Colors } from '@/config/colors';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const WINDOW_WIDTH = Dimensions.get('window').width;
const BREADCRUMB_HEIGHT = 44;
const BREADCRUMB_WIDTH = WINDOW_WIDTH * 0.7;

// Mock data (move to separate files in real implementation)
const MERCHANTS = [
  { id: '1', name: 'Amazon' },
  { id: '2', name: 'Walmart' },
  { id: '3', name: 'Target' },
  // ... more merchants
];

const CATEGORIES = [
  { id: '1', name: 'Entertainment', emoji: '🎬' },
  { id: '2', name: 'Shopping', emoji: '🛍️' },
  { id: '3', name: 'Travel', emoji: '✈️' },
  // ... more categories
];

const RADIUS_OPTIONS = [
  { label: '100m', value: 100 },
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '5km', value: 5000 },
];

const BreadcrumbTrail = ({ cardType }) => {
  return (
    <View 
      backgroundColor={Colors.dark.backgroundSecondary}
      width={BREADCRUMB_WIDTH}
      height={BREADCRUMB_HEIGHT}
      borderRadius={BREADCRUMB_HEIGHT / 2}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal={4}
    >
      <View 
        width={BREADCRUMB_HEIGHT - 8} 
        height={BREADCRUMB_HEIGHT - 8}
        borderRadius={(BREADCRUMB_HEIGHT - 8) / 2}
        margin={4}
        alignItems="center"
        justifyContent="center"
        opacity={0.5}
      >
        <Ionicons name="card" size={20} color={Colors.dark.text} />
      </View>
      <View 
        backgroundColor={Colors.dark.primary}
        width={BREADCRUMB_HEIGHT - 8} 
        height={BREADCRUMB_HEIGHT - 8}
        borderRadius={(BREADCRUMB_HEIGHT - 8) / 2}
        margin={4}
        alignItems="center"
        justifyContent="center"
      >
        <Ionicons name="settings-sharp" size={20} color="white" />
      </View>
      <View 
        width={BREADCRUMB_HEIGHT - 8} 
        height={BREADCRUMB_HEIGHT - 8}
        borderRadius={(BREADCRUMB_HEIGHT - 8) / 2}
        margin={4}
        alignItems="center"
        justifyContent="center"
        opacity={0.5}
      >
        <Ionicons name="checkmark" size={20} color={Colors.dark.text} />
      </View>
    </View>
  );
};

const CommonSettings = ({
  cardName,
  setCardName,
  emoji,
  setEmoji,
  cardColor,
  setCardColor,
  isPaused,
  setIsPaused,
  limits,
  setLimits,
  showEmojiPicker,
  setShowEmojiPicker,
  showColorWheel,
  setShowColorWheel,
}) => {
  return (
    <YStack gap="$4">
      {/* Card Name */}
      <YStack gap="$2">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
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
          p={0}
          px="$4"
          fontWeight="700"
        />
      </YStack>

      {/* Limits */}
      <YStack gap="$2">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Spending Limits
        </Text>
        <YStack gap="$3">
          {Object.entries(limits).map(([key, value]) => (
            <XStack key={key} ai="center" jc="space-between">
              <Text color={Colors.dark.text} fontSize="$4">
                {key.charAt(0).toUpperCase() + key.slice(1)} Limit
              </Text>
              <Input
                value={value.toString()}
                onChangeText={(text) => setLimits(prev => ({ ...prev, [key]: text }))}
                keyboardType="numeric"
                backgroundColor={Colors.dark.backgroundSecondary}
                borderWidth={0}
                color={Colors.dark.text}
                width={120}
                textAlign="right"
                px="$3"
              />
            </XStack>
          ))}
        </YStack>
      </YStack>

      {/* Card Status */}
      <YStack gap="$2">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Card Status
        </Text>
        <XStack ai="center" jc="space-between" backgroundColor={Colors.dark.backgroundSecondary} p="$3" br="$4">
          <Text color={Colors.dark.text} fontSize="$4">Pause Card</Text>
          <Switch
            checked={isPaused}
            onCheckedChange={setIsPaused}
            backgroundColor={isPaused ? Colors.dark.primary : Colors.dark.backgroundTertiary}
          />
        </XStack>
      </YStack>

      {/* Customization */}
      <YStack gap="$2">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Customization
        </Text>
        <XStack gap="$2">
          <Button
            f={1}
            backgroundColor={Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={() => setShowEmojiPicker(true)}
          >
            <Text fontSize={24} mr="$2">{emoji}</Text>
            <Text color={Colors.dark.text}>Change Icon</Text>
          </Button>
          <Button
            f={1}
            backgroundColor={Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={() => setShowColorWheel(true)}
          >
            <View
              width={24}
              height={24}
              borderRadius={12}
              backgroundColor={cardColor}
              mr="$2"
            />
            <Text color={Colors.dark.text}>Change Color</Text>
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
};

const MerchantSettings = ({ selectedMerchant, setSelectedMerchant }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredMerchants = MERCHANTS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <YStack gap="$4">
      <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Select Merchant
      </Text>
      <Input
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search merchants..."
        backgroundColor={Colors.dark.backgroundSecondary}
        borderWidth={0}
        color={Colors.dark.text}
        placeholderTextColor={Colors.dark.textTertiary}
      />
      <YStack gap="$2">
        {filteredMerchants.map(merchant => (
          <Button
            key={merchant.id}
            backgroundColor={selectedMerchant?.id === merchant.id ? Colors.dark.primary : Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={() => setSelectedMerchant(merchant)}
          >
            <Text color={selectedMerchant?.id === merchant.id ? 'white' : Colors.dark.text}>
              {merchant.name}
            </Text>
          </Button>
        ))}
      </YStack>
    </YStack>
  );
};

const LocationSettings = ({ location, setLocation, radius, setRadius }) => {
  return (
    <YStack gap="$4">
      <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
        Select Location
      </Text>
      <View height={200} backgroundColor={Colors.dark.backgroundSecondary} borderRadius={12} overflow="hidden">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onRegionChangeComplete={(region) => setLocation({
            latitude: region.latitude,
            longitude: region.longitude,
          })}
        >
          <Marker
            coordinate={location}
            draggable
            onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
          />
          <MapCircle
            center={location}
            radius={radius}
            fillColor="rgba(255, 0, 0, 0.1)"
            strokeColor="rgba(255, 0, 0, 0.5)"
          />
        </MapView>
      </View>
      <YStack gap="$2">
        <Text color={Colors.dark.textSecondary} fontSize="$3" fontWeight="600" fontFamily="$heading">
          Radius
        </Text>
        <XStack flexWrap="wrap" gap="$2">
          {RADIUS_OPTIONS.map(option => (
            <Button
              key={option.value}
              backgroundColor={radius === option.value ? Colors.dark.primary : Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => setRadius(option.value)}
            >
              <Text color={radius === option.value ? 'white' : Colors.dark.text}>
                {option.label}
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
};

const CategorySettings = ({ selectedCategory, setSelectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCategories = CATEGORIES.filter(c => 
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
      <YStack gap="$2">
        {filteredCategories.map(category => (
          <Button
            key={category.id}
            backgroundColor={selectedCategory?.id === category.id ? Colors.dark.primary : Colors.dark.backgroundSecondary}
            pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
            onPress={() => setSelectedCategory(category)}
          >
            <XStack ai="center" gap="$2">
              <Text fontSize={20}>{category.emoji}</Text>
              <Text color={selectedCategory?.id === category.id ? 'white' : Colors.dark.text}>
                {category.name}
              </Text>
            </XStack>
          </Button>
        ))}
      </YStack>
    </YStack>
  );
};

const CardConfigScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { cardType, initialData } = route.params;

  // Common state
  const [cardName, setCardName] = useState('');
  const [emoji, setEmoji] = useState('💳');
  const [cardColor, setCardColor] = useState('#E14C81');
  const [isPaused, setIsPaused] = useState(false);
  const [limits, setLimits] = useState({
    transaction: '1000',
    daily: '5000',
    weekly: '10000',
    monthly: '25000'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);

  // Type-specific state
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [location, setLocation] = useState({
    latitude: 29.3759,
    longitude: 47.9774
  });
  const [radius, setRadius] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <View f={1} backgroundColor={Colors.dark.background}>
      <StatusBar barStyle="light-content" />
      
      {/* Breadcrumb */}
      <View ai="center" mt={insets.top + 20}>
        <BreadcrumbTrail cardType={cardType} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <YStack gap="$6" pb="$8">
          {/* Card Preview */}
          <YStack gap="$1" ai="center" mt="$4">
            <View height={CARD_HEIGHT * 0.3} overflow="hidden" borderRadius={20} w="100%">
              <View scale={1.35} transformOrigin="top" perspectiveOrigin="top" ai="center">
                <CardComponent
                  displayData={{
                    type: cardType,
                    label: cardName || 'New Card',
                    emoji: emoji,
                    color: cardColor,
                    isPaused,
                  }}
                />
              </View>
            </View>
          </YStack>

          {/* Common Settings */}
          <CommonSettings
            cardName={cardName}
            setCardName={setCardName}
            emoji={emoji}
            setEmoji={setEmoji}
            cardColor={cardColor}
            setCardColor={setCardColor}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            limits={limits}
            setLimits={setLimits}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            showColorWheel={showColorWheel}
            setShowColorWheel={setShowColorWheel}
          />

          {/* Type-specific Settings */}
          {cardType === 'Merchant' && (
            <MerchantSettings
              selectedMerchant={selectedMerchant}
              setSelectedMerchant={setSelectedMerchant}
            />
          )}
          {cardType === 'Location' && (
            <LocationSettings
              location={location}
              setLocation={setLocation}
              radius={radius}
              setRadius={setRadius}
            />
          )}
          {cardType === 'Category' && (
            <CategorySettings
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}

          {/* Bottom Buttons */}
          <YStack width="100%" gap="$2.5" borderTopWidth={1} borderTopColor={`${Colors.dark.border}40`} pt="$4" mt="$4">
            <Button
              backgroundColor={Colors.dark.primary}
              pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
              onPress={() => {
                // Handle next step
              }}
              size="$5"
              borderRadius={15}
            >
              <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Next
              </Text>
            </Button>
            <Button
              backgroundColor={Colors.dark.backgroundSecondary}
              pressStyle={{ backgroundColor: Colors.dark.backgroundTertiary }}
              onPress={() => navigation.goBack()}
              size="$5"
              borderRadius={15}
            >
              <Text color={Colors.dark.text} fontSize="$4" fontWeight="600" fontFamily="$archivo">
                Back
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Pickers */}
      <BottomSheet isOpen={showColorWheel} onClose={() => setShowColorWheel(false)}>
        <YStack gap="$5" px="$4" mt="$2" pb="$6">
          <Text color={Colors.dark.text} fontSize="$6" fontFamily="$archivoBlack">
            Card Color
          </Text>
          <ColorPicker value={cardColor} onComplete={({ hex }) => setCardColor(hex)}>
            <Preview hideInitialColor />
            <Panel1 />
            <HueSlider />
          </ColorPicker>
          <Button
            backgroundColor={Colors.dark.primary}
            pressStyle={{ backgroundColor: Colors.dark.primaryDark }}
            onPress={() => setShowColorWheel(false)}
            size="$5"
            borderRadius={15}
          >
            <Text color="white" fontSize="$4" fontWeight="600" fontFamily="$archivo">
              Select
            </Text>
          </Button>
        </YStack>
      </BottomSheet>

      <EmojiPicker
        onEmojiSelected={({ emoji }) => {
          setEmoji(emoji);
          setShowEmojiPicker(false);
        }}
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        enableSearchBar
        theme={{
          backdrop: `${Colors.dark.background}88`,
          knob: Colors.dark.primary,
          container: Colors.dark.backgroundSecondary,
          header: Colors.dark.text,
          skinTonesContainer: Colors.dark.backgroundTertiary,
          category: {
            icon: Colors.dark.textSecondary,
            iconActive: Colors.dark.text,
            container: Colors.dark.backgroundSecondary,
            containerActive: Colors.dark.primary,
          },
          search: {
            text: Colors.dark.text,
            placeholder: Colors.dark.textTertiary,
            icon: Colors.dark.text,
            background: Colors.dark.backgroundTertiary,
            border: Colors.dark.border,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
});

export default CardConfigScreen; 