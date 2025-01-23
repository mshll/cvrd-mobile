import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import CardCarousel from '../components/CardCarousel';
import { Store, Tag, MapPin, Flame } from '@tamagui/lucide-icons';
import { useCards } from '@/hooks/useCards';

function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme || 'light'];
  const { cardsByType, getCardDisplayData } = useCards();

  const SECTIONS = [
    {
      title: 'Merchant Locked Cards',
      data: (cardsByType['Merchant'] || []).map(getCardDisplayData),
      icon: Store,
    },
    {
      title: 'Category Locked Cards',
      data: (cardsByType['Category'] || []).map(getCardDisplayData),
      icon: Tag,
    },
    {
      title: 'Location Locked Cards',
      data: (cardsByType['Location'] || []).map(getCardDisplayData),
      icon: MapPin,
    },
    {
      title: 'Burner Cards',
      data: (cardsByType['Burner'] || []).map(getCardDisplayData),
      icon: Flame,
    },
  ];

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
