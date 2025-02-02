import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import CardCarousel from '../components/CardCarousel';
import {
  BuildingStorefrontIcon,
  FireIcon,
  MapPinIcon,
  TagIcon,
  ArrowsUpDownIcon,
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  CreditCardIcon,
  PauseIcon,
  XCircleIcon,
  ShareIcon,
} from 'react-native-heroicons/solid';
import { useCards } from '@/hooks/useCards';
import { useSectionOrder } from '@/hooks/useSectionOrder';
import { ScrollView, View, Button, XStack, Text, YStack, Spinner, Card, Avatar } from 'tamagui';
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import DraggableList from '@/components/DraggableList';
import { BlurView } from 'expo-blur';
import { user } from '@/data/user';
import { formatCurrency } from '@/utils/utils';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Platform, StyleSheet } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import BottomSheet from '@/components/BottomSheet';

// ============================================================================
// Constants & Config
// ============================================================================

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

// ============================================================================
// Utility Components
// ============================================================================

function StatCard({ icon: Icon, iconColor, label, value, dotColor }) {
  return (
    <Card f={1} bg={Colors.dark.backgroundSecondary} p="$4" br="$5" gap="$1">
      <XStack ai="center" gap="$2" mb="$1">
        {dotColor ? <View w={12} h={12} br="$6" bg={dotColor} /> : <Icon size={12} color={iconColor} />}
        <Text color={Colors.dark.textSecondary} fontSize="$3">
          {label}
        </Text>
      </XStack>
      <Text color={Colors.dark.text} fontSize="$5" fontWeight="700">
        {value}
      </Text>
    </Card>
  );
}

// ============================================================================
// Feature Components
// ============================================================================

function UserGreeting() {
  return (
    <XStack ai="center" mb="$2" gap="$3">
      {/* <Avatar circular size="$6">
        <Avatar.Image source={{ uri: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` }} />
        <Avatar.Fallback backgroundColor={Colors.dark.backgroundSecondary} />
      </Avatar>
      <XStack>
        <Text color={Colors.dark.text} fontSize="$7" fontFamily="$archivoBlack">
          Hi,{' '}
        </Text>
        <Text color={Colors.dark.primary} fontSize="$7" fontFamily="$archivoBlack">
          {user.name.split(' ')[0]}
        </Text>
      </XStack> */}
    </XStack>
  );
}

function SpendingStats() {

  return (
    <YStack gap="$3" mb="$2" px={16}>
      <XStack ai="center" mb="$2" gap="$2">
        <BanknotesIcon size={20} color={Colors.dark.text} />
        <Text color={Colors.dark.text} fontSize="$4" fontFamily="$archivoBlack">
          Spend
        </Text>
      </XStack>
      <XStack gap="$3">
        <Card 
          f={1} 
          bg={Colors.dark.card} 
          p="$4" 
          br={12}
          borderWidth={1}
          borderColor={Colors.dark.border}
        >
          <Text color={Colors.dark.textSecondary} fontSize="$3" mb="$2">
            Today
          </Text>
          <Text color={Colors.dark.text} fontSize="$5" fontWeight="700">
            {formatCurrency(user.spend_today)}
          </Text>
        </Card>
        <Card 
          f={1} 
          bg={Colors.dark.card} 
          p="$4" 
          br={12}
          borderWidth={1}
          borderColor={Colors.dark.border}
        >
          <Text color={Colors.dark.textSecondary} fontSize="$3" mb="$2">
            This Month
          </Text>
          <Text color={Colors.dark.text} fontSize="$5" fontWeight="700">
            {formatCurrency(user.spend_month)}
          </Text>
        </Card>
      </XStack>
    </YStack>
  );
}

function CardStats() {
  const { cards } = useCards();

  const stats = useMemo(() => {
    return cards.reduce(
      (acc, card) => {
        if (!card.is_closed && !card.is_paused) acc.active++;
        if (card.is_paused) acc.paused++;
        if (card.is_closed) acc.closed++;
        if (card.is_shared) acc.shared++;
        return acc;
      },
      { active: 0, paused: 0, closed: 0, shared: 0 }
    );
  }, [cards]);

  return (
    // <YStack gap="$3">
    //   <XStack ai="center" gap="$2">
    //     <CreditCardIcon size={20} color={Colors.dark.text} />
    //     <Text color={Colors.dark.text} fontSize="$4" fontFamily="$archivoBlack">
    //       Cards
    //     </Text>
    //   </XStack>
    //   <XStack gap="$3">
    //     <StatCard dotColor={Colors.cards.green} label="Active" value={stats.active} />
    //     <StatCard icon={PauseIcon} iconColor={Colors.cards.yellow} label="Paused" value={stats.paused} />
    //   </XStack>
    //   <XStack gap="$3">
    //     <StatCard icon={XCircleIcon} iconColor={Colors.cards.pink} label="Closed" value={stats.closed} />
    //     <StatCard icon={ShareIcon} iconColor={Colors.cards.blue} label="Shared" value={stats.shared} />
    //   </XStack>
    // </YStack>
    <></>
  );
}

function SpendingSummary() {
  return (
    <YStack mb="$4" gap="$4">
      {/* <UserGreeting /> */}
      <SpendingStats />
      {/* <CardStats /> */}
    </YStack>
  );
}

function CustomizeButton({ onPress }) {
  return (
    <XStack >
      <Button
        f={1}
        size="$5"
        bg={Colors.dark.card}
        pressStyle={{ bg: Colors.dark.backgroundTertiary }}
        onPress={onPress}
        marginHorizontal={16}
        icon={<AdjustmentsHorizontalIcon size={20} color={Colors.dark.text} />}
        br={12}
        borderWidth={1}
        borderColor={Colors.dark.border}
      >
        <Text color={Colors.dark.text} fontWeight="700">
          Customize
        </Text>
      </Button>
    </XStack>
  );
}

function ReorganizeSheet({ isOpen, onOpenChange, sections, onReorder, onReset }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onOpenChange} enableContentPanningGesture={false}>
      <YStack px="$4" pt="$5" pb="$10">
        <XStack jc="space-between" ai="center" mb="$3">
          <Text color={Colors.dark.text} fontSize="$6" fontFamily="$archivoBlack">
            Customize
          </Text>
          <XStack gap="$2">
            <Button size="$3" bg="transparent" pressStyle={{ bg: Colors.dark.backgroundTertiary }} onPress={onReset}>
              <Text color={Colors.dark.textSecondary}>Reset</Text>
            </Button>
            <Button
              size="$3"
              bg={Colors.dark.backgroundSecondary}
              pressStyle={{ bg: Colors.dark.backgroundTertiary }}
              onPress={() => onOpenChange(false)}
            >
              <Text color={Colors.dark.text}>Done</Text>
            </Button>
          </XStack>
        </XStack>
        <View backgroundColor={Colors.dark.background}>
          <DraggableList sections={sections} onReorder={onReorder} />
        </View>
      </YStack>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

// ============================================================================
// Main Screen Component
// ============================================================================

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = Colors.dark;
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
          paddingTop: insets.top - 20,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SpendingSummary />
        {sections.map((section) => (
          <CardCarousel key={section.id} title={section.title} data={section.data} icon={section.icon} />
        ))}
        <CustomizeButton onPress={() => setIsReorganizing(true)} />
      </ScrollView>

      <ReorganizeSheet
        isOpen={isReorganizing}
        onOpenChange={setIsReorganizing}
        sections={sections}
        onReorder={handleReorder}
        onReset={resetOrder}
      />
    </View>
  );
}

export default HomeScreen;
