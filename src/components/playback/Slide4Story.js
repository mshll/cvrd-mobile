import React, { useEffect, useState } from 'react';
import { VideoSlide } from './VideoSlide';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, YStack, XStack, Button } from 'tamagui';
import { Colors } from '@/context/ColorSchemeContext';
import { getUserCards } from '@/api/cards';
import { fetchCardTransactions } from '@/api/transactions';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedYStack = Animated.createAnimatedComponent(YStack);
const AnimatedXStack = Animated.createAnimatedComponent(XStack);

// Location Badge Component
const LocationBadge = ({ name, color, style }) => (
  <Button backgroundColor={color || Colors.cards.navy} size="$3" borderRadius={20} height={32} px="$3" style={style}>
    <Text color="white" fontSize="$3" fontFamily="$archivoBlack">
      {name}
    </Text>
  </Button>
);

export function Slide4Story() {
  const colors = Colors;
  const [locationStats, setLocationStats] = useState({
    totalRadius: 0,
    totalCards: 0,
    topLocations: [
      { name: 'Loading...', transactions: 0, color: colors.cards.white },
      { name: 'Loading...', transactions: 0, color: colors.cards.white },
      { name: 'Loading...', transactions: 0, color: colors.cards.white },
    ],
  });

  // Animation values
  const titleOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const badgesOpacity = useSharedValue(0);

  useEffect(() => {
    async function fetchLocationData() {
      try {
        const cards = await getUserCards();

        // Filter location cards and ensure they're active
        const locationCards = cards.filter((card) => card.cardType === 'LOCATION_LOCKED' && !card.closed);

        if (locationCards.length === 0) {
          setLocationStats({
            totalRadius: 0,
            totalCards: 0,
            topLocations: [
              { name: 'No Location Cards', transactions: 0, color: colors.cards.white },
              { name: 'Create Your First', transactions: 0, color: colors.cards.white },
              { name: 'Location Card', transactions: 0, color: colors.cards.white },
            ],
          });
          return;
        }

        // Calculate total radius
        const totalRadius = locationCards.reduce((sum, card) => sum + (Number(card.radius) || 0), 0);

        // Get transactions for each location card
        const locationTransactions = await Promise.all(
          locationCards.map(async (card) => {
            const transactions = await fetchCardTransactions(card.id);
            return {
              name: card.cardName,
              transactions: transactions.length,
              color: colors.cards.navy,
              latitude: card.latitude,
              longitude: card.longitude,
            };
          })
        );

        // Sort locations by number of transactions
        const sortedLocations = locationTransactions.sort((a, b) => b.transactions - a.transactions);

        // Prepare top 3 locations (or fill with placeholders if less than 3)
        const topLocations = [...sortedLocations];
        while (topLocations.length < 3) {
          topLocations.push({
            name: 'None',
            transactions: 0,
            color: colors.cards.white,
          });
        }

        setLocationStats({
          totalRadius: Number(totalRadius.toFixed(2)),
          totalCards: locationCards.length,
          topLocations: topLocations.slice(0, 3),
        });
      } catch (error) {
        console.log('Error fetching location data:', error);
        setLocationStats({
          totalRadius: 0,
          totalCards: 0,
          topLocations: [
            { name: 'Error Loading', transactions: 0, color: colors.cards.white },
            { name: 'Please Try', transactions: 0, color: colors.cards.white },
            { name: 'Again Later', transactions: 0, color: colors.cards.white },
          ],
        });
      }
    }

    fetchLocationData();
  }, []);

  useEffect(() => {
    // Title appears first
    const titleAppear = setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
    }, 1000);

    // Stats appear second
    const statsAppear = setTimeout(() => {
      statsOpacity.value = withTiming(1, { duration: 500 });
    }, 2500);

    // Badges appear third
    const badgesAppear = setTimeout(() => {
      badgesOpacity.value = withTiming(1, { duration: 500 });
    }, 4000);

    // Everything fades out at 9 seconds
    const fadeOut = setTimeout(() => {
      titleOpacity.value = withTiming(0, { duration: 500 });
      statsOpacity.value = withTiming(0, { duration: 500 });
      badgesOpacity.value = withTiming(0, { duration: 500 });
    }, 8500);

    return () => {
      clearTimeout(titleAppear);
      clearTimeout(statsAppear);
      clearTimeout(badgesAppear);
      clearTimeout(fadeOut);
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const badgesStyle = useAnimatedStyle(() => ({
    opacity: badgesOpacity.value,
  }));

  return (
    <YStack f={1}>
      <VideoSlide videoSource={require('@/../assets/playback-vids/slide4.MP4')} />

      {/* Main Title */}
      <AnimatedYStack pos="absolute" t="15%" l={0} r={0} ai="center" style={titleStyle}>
        <AnimatedText fontFamily="$archivoBlack" fontSize="$8" color="white" textAlign="center" textShadowRadius={5}>
          LOCATION CARDS
        </AnimatedText>
      </AnimatedYStack>

      {/* Stats */}
      <AnimatedYStack pos="absolute" t="25%" l={0} r={0} ai="center" gap="$2" style={statsStyle}>
        <AnimatedText fontFamily="$archivoBlack" fontSize="$6" color="white" textAlign="center" textShadowRadius={5}>
          Total Cards: {locationStats.totalCards}
        </AnimatedText>
        <AnimatedText fontFamily="$archivoBlack" fontSize="$6" color="white" textAlign="center" textShadowRadius={5}>
          Combined Radius: {locationStats.totalRadius}km
        </AnimatedText>
      </AnimatedYStack>

      {/* Location Badges */}
      <AnimatedXStack
        pos="absolute"
        t="38%"
        l={0}
        r={0}
        px="$4"
        flexWrap="wrap"
        gap="$2"
        jc="center"
        style={badgesStyle}
      >
        {locationStats.topLocations.map((location, index) => (
          <LocationBadge key={index} name={location.name} color={location.color} />
        ))}
      </AnimatedXStack>
    </YStack>
  );
}
