import { View, Text, YStack, XStack, Button, Input } from 'tamagui';
import { Colors, useColors } from '@/config/colors';
import { useState, useCallback, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCards } from '@/hooks/useCards';
import { StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import MapView, { Circle as MapCircle, Marker } from 'react-native-maps';
import { QuestionMarkCircleIcon, PencilIcon, ChevronLeftIcon } from 'react-native-heroicons/solid';
import BottomSheet from '@/components/BottomSheet';
import Slider from '@react-native-community/slider';

// Convert miles to km
const DEFAULT_RADIUS = 0.5; // in km
const MAX_RADIUS = 100; // in km
const MIN_RADIUS = 0.2; // in km

const EditLocationScreen = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const route = useRoute();
  const { cardId, initialLocation, initialRadius, onSave } = route.params;
  const { getCardById, updateCard } = useCards();
  const card = cardId ? getCardById(cardId) : null;
  const mapRef = useRef(null);

  // Get the appropriate color - either from existing card or use primary color
  const markerColor = card ? Colors.cards[card.card_color] : colors.primary;

  // State
  const [location, setLocation] = useState(
    initialLocation ||
      (card?.latitude && card?.longitude
        ? { latitude: card.latitude, longitude: card.longitude }
        : { latitude: 29.3759, longitude: 47.9774 })
  );
  const [radius, setRadius] = useState(initialRadius || card?.radius || DEFAULT_RADIUS);
  const [showHelp, setShowHelp] = useState(false);
  const [isEditingRadius, setIsEditingRadius] = useState(false);
  const [tempRadius, setTempRadius] = useState('');

  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: (radius * 4) / 111,
    longitudeDelta: (radius * 4) / 111,
  };

  const handleSave = useCallback(() => {
    if (cardId) {
      // If editing an existing card
      updateCard(cardId, {
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
      });
    } else if (onSave) {
      // If selecting location during card creation
      onSave(location, radius);
    }
    navigation.goBack();
  }, [cardId, location, radius, updateCard, onSave, navigation]);

  const handleRadiusInput = (text) => {
    setTempRadius(text);
    const value = parseFloat(text);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, MIN_RADIUS), MAX_RADIUS);
      setRadius(clampedValue);
    }
  };

  const handleRadiusSubmit = () => {
    setIsEditingRadius(false);
  };

  return (
    <View f={1} backgroundColor={colors.background}>
      <StatusBar barStyle="light-content" />

      {/* Full Screen Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onLongPress={(e) => setLocation(e.nativeEvent.coordinate)}
      >
        <Marker
          coordinate={location}
          draggable
          onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
          pinColor={markerColor}
        />
        <MapCircle
          center={location}
          radius={radius * 1000} // Convert km to meters
          strokeWidth={2}
          strokeColor={markerColor}
          fillColor={`${markerColor}40`}
        />
      </MapView>

      {/* Top Bar */}
      <XStack pt={60} px="$4" jc="space-between" ai="center">
        <Button
          size="$3"
          circular
          backgroundColor={colors.backgroundSecondary}
          pressStyle={{ backgroundColor: colors.backgroundTertiary }}
          onPress={() => navigation.goBack()}
          icon={<ChevronLeftIcon size={20} color={colors.text} />}
          borderWidth={1}
          borderColor={colors.border}
        />
        <TouchableOpacity
          onPress={() => {
            setTempRadius(radius.toFixed(1));
            setIsEditingRadius(true);
          }}
        >
          <XStack
            backgroundColor={colors.backgroundSecondary}
            px="$3"
            py="$2"
            br={8}
            gap="$2"
            ai="center"
            borderWidth={1}
            borderColor={colors.border}
          >
            {isEditingRadius ? (
              <Input
                keyboardType="decimal-pad"
                inputMode="decimal"
                value={tempRadius}
                onChangeText={handleRadiusInput}
                onBlur={handleRadiusSubmit}
                onSubmitEditing={handleRadiusSubmit}
                returnKeyType="done"
                autoFocus
                width={80}
                textAlign="center"
                fontSize="$4"
                color={colors.text}
                borderWidth={0}
                backgroundColor="transparent"
                fontFamily="$archivoBlack"
              />
            ) : (
              <>
                <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
                  {radius.toFixed(1)} km
                </Text>
                <PencilIcon size={14} color={colors.textSecondary} />
              </>
            )}
          </XStack>
        </TouchableOpacity>
        <Button
          size="$3"
          circular
          backgroundColor={colors.backgroundSecondary}
          pressStyle={{ backgroundColor: colors.backgroundTertiary }}
          onPress={() => setShowHelp(true)}
          icon={<QuestionMarkCircleIcon size={20} color={colors.text} />}
          borderWidth={1}
          borderColor={colors.border}
        />
      </XStack>

      {/* Bottom Controls */}
      <YStack
        position="absolute"
        bottom={40}
        left="$4"
        right="$4"
        gap="$4"
        backgroundColor={colors.backgroundSecondary}
        p="$4"
        br={12}
        borderWidth={1}
        borderColor={colors.border}
      >
        <YStack gap="$2">
          <Text color={colors.textSecondary} fontSize="$3" fontWeight="600">
            Coverage Radius
          </Text>
          <XStack ai="center" gap="$2">
            <Text color={colors.textSecondary} fontSize="$3">
              {MIN_RADIUS}
            </Text>
            <View f={1} h={40} jc="center">
              <Slider
                style={{ flex: 1 }}
                value={radius}
                minimumValue={MIN_RADIUS}
                maximumValue={MAX_RADIUS}
                step={0.1}
                onValueChange={setRadius}
                minimumTrackTintColor={markerColor}
                maximumTrackTintColor={colors.backgroundTertiary}
                thumbTintColor={markerColor}
              />
            </View>
            <Text color={colors.textSecondary} fontSize="$3">
              {MAX_RADIUS}
            </Text>
          </XStack>
        </YStack>

        <Button
          backgroundColor={colors.primary}
          pressStyle={{ backgroundColor: colors.primaryDark }}
          onPress={handleSave}
          size="$5"
          br={12}
        >
          <Text color="white" fontSize="$4" fontWeight="600" fontFamily={'$archivo'}>
            Save Changes
          </Text>
        </Button>
      </YStack>

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
    </View>
  );
};

export default EditLocationScreen;
