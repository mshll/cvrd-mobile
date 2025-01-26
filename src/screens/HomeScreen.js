import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import CardCarousel from '../components/CardCarousel';
import { BuildingStorefrontIcon, FireIcon, MapPinIcon, TagIcon, ArrowsUpDownIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/solid';
import { useCards } from '@/hooks/useCards';
import { useSectionOrder } from '@/hooks/useSectionOrder';
import { ScrollView, View, Button, Sheet, XStack, Text, YStack, Spinner } from 'tamagui';
import { useState, useMemo } from 'react';
import DraggableList from '@/components/DraggableList';
import { BlurView } from 'expo-blur';

const SECTION_CONFIG = {
  merchant: {
    id: 'merchant',
    title: 'Merchant Locked Cards',
    icon: BuildingStorefrontIcon,
  },
  category: {
    id: 'category',
    title: 'Category Locked Cards',
    icon: TagIcon,
  },
  location: {
    id: 'location',
    title: 'Location Locked Cards',
    icon: MapPinIcon,
  },
  burner: {
    id: 'burner',
    title: 'Burner Cards',
    icon: FireIcon,
  },
};

function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme || 'light'];
  const { cardsByType, getCardDisplayData } = useCards();
  const { order, isLoading, saveOrder, resetOrder } = useSectionOrder();
  const [isReorganizing, setIsReorganizing] = useState(false);

  const sections = useMemo(() => {
    return order.map((sectionId) => ({
      ...SECTION_CONFIG[sectionId],
      data: (cardsByType[SECTION_CONFIG[sectionId].title.split(' ')[0]] || []).map(getCardDisplayData),
    }));
  }, [order, cardsByType]);

  const handleReorder = async (reorderedSections) => {
    const newOrder = reorderedSections.map((section) => section.id);
    await saveOrder(newOrder);
  };

  if (isLoading) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Spinner size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <View f={1} bg={colors.background}>
      <ScrollView
        f={1}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 100, // Account for floating navbar
        }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <CardCarousel key={section.id} title={section.title} data={section.data} icon={section.icon} />
        ))}

        {/* Reorganize Button */}
        <XStack px="$4">
          <Button
            f={1}
            size="$5"
            bg={Colors.dark.backgroundSecondary}
            pressStyle={{ bg: Colors.dark.backgroundTertiary }}
            onPress={() => setIsReorganizing(true)}
            icon={<AdjustmentsHorizontalIcon size={20} color={Colors.dark.text} />}
          >
            <Text color={Colors.dark.text} fontWeight="700">
              Customize
            </Text>
          </Button>
        </XStack>
      </ScrollView>

      {/* Reorganize Sheet */}
      <Sheet modal open={isReorganizing} onOpenChange={setIsReorganizing} snapPointsMode="fit" zIndex={1000000} animation="medium" disableDrag>
        <Sheet.Overlay>
          <BlurView intensity={50} tint="dark" style={{ flex: 1 }} />
        </Sheet.Overlay>
        <Sheet.Handle onPress={() => setIsReorganizing(false)} backgroundColor={Colors.dark.background} />
        <Sheet.Frame bg={Colors.dark.background}>
          <YStack px="$4" pt="$5" pb="$10">
            <XStack jc="space-between" ai="center" mb="$3">
              <Text color={Colors.dark.text} fontSize="$6" fontFamily="$archivoBlack">
                Customize
              </Text>
              <Button size="$3" bg="transparent" pressStyle={{ bg: Colors.dark.backgroundTertiary }} onPress={resetOrder}>
                <Text color={Colors.dark.textSecondary}>Reset</Text>
              </Button>
            </XStack>
            <View backgroundColor={Colors.dark.background}>
              <DraggableList sections={sections} onReorder={handleReorder} />
            </View>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}

export default HomeScreen;
