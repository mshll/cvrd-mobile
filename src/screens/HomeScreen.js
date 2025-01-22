import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import CardCarousel from '../components/CardCarousel';
import { Store, Tag, MapPin, Flame } from '@tamagui/lucide-icons';
import CardComponent from '@/components/CardComponent';

const CARD_TYPES = ['Merchant', 'Category', 'Location', 'Burner'];
const CARD_COLORS = ['pink', 'green', 'blue', 'yellow'];

// Labels and emojis for different card purposes
const CARD_LABELS = {
  Food: ['🍕', '🍔', '🍜', '🥗', '🍣'],
  Travel: ['✈️', '🚆', '🏨', '🗺️', '🌎'],
  Shopping: ['🛍️', '👕', '👟', '💄', '🎮'],
  Entertainment: ['🎬', '🎭', '🎪', '🎨', '🎮'],
  Health: ['💊', '🏥', '🧘‍♀️', '🚑', '⚕️'],
  Education: ['📚', '🎓', '✏️', '🔬', '📝'],
  Tech: ['💻', '📱', '🖥️', '🎧', '⌚'],
  Sports: ['⚽', '🏀', '🎾', '🏃‍♂️', '🚴‍♀️'],
};

const generateRandomCard = () => {
  // Get random label category and its emoji
  const categories = Object.keys(CARD_LABELS);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const emojis = CARD_LABELS[randomCategory];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return {
    id: Math.random().toString(36).substring(7),
    type: CARD_TYPES[Math.floor(Math.random() * CARD_TYPES.length)],
    backgroundColor: CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)],
    lastFourDigits: Math.floor(1000 + Math.random() * 9000).toString(),
    label: randomCategory,
    emoji: randomEmoji,
  };
};

const DUMMY_DATA = Array(30)
  .fill(null)
  .map(() => generateRandomCard());

const SECTIONS = [
  {
    title: 'Merchant Locked Cards',
    data: DUMMY_DATA.filter((card) => card.type === 'Merchant'),
    icon: Store,
  },
  {
    title: 'Category Locked Cards',
    data: DUMMY_DATA.filter((card) => card.type === 'Category'),
    icon: Tag,
  },
  {
    title: 'Location Locked Cards',
    data: DUMMY_DATA.filter((card) => card.type === 'Location'),
    icon: MapPin,
  },
  {
    title: 'Burner Cards',
    data: DUMMY_DATA.filter((card) => card.type === 'Burner'),
    icon: Flame,
  },
];

function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme || 'light'];

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 100, // Account for floating navbar
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <CardCarousel key={section.title} title={section.title} data={section.data} icon={section.icon} />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
});

export default HomeScreen;
