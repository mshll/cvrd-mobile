import * as React from 'react';
import { useColors } from '@/context/ColorSchemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshControl } from 'react-native';
import CardCarousel from '../components/CardCarousel';
import { useCards } from '@/hooks/useCards';
import { useSectionOrder } from '@/hooks/useSectionOrder';
import { ScrollView, View, Button, XStack, Text, YStack, Spinner, Card, Avatar } from 'tamagui';
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import DraggableList from '@/components/DraggableList';
import { formatCurrency } from '@/utils/utils';
import BottomSheet from '@/components/BottomSheet';
import { useUser } from '@/hooks/useUser';
import { SpendingRecapButton } from '@/components/SpendingRecapButton';
import { SpendingRecapStory } from '@/components/SpendingRecapStory';
import { useNavigation } from '@react-navigation/native';
import CompactCardComponent from '@/components/CompactCardComponent';
import { TouchableOpacity } from 'react-native';
import SearchBar from '@/components/SearchBar';
import SearchView from '@/components/SearchView';
import {
  BuildingStorefrontIcon,
  FireIcon,
  MapPinIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from 'react-native-heroicons/solid';
import { AIInsightsButton } from '@/components/AIInsightsButton';
import { AIInsightsSheet } from '@/components/AIInsightsSheet';
import { useAIInsights } from '@/hooks/useAIInsights';
import { fetchUserTransactions } from '@/api/transactions';
import { usePlans } from '@/hooks/usePlans';

// ============================================================================
// Constants & Config
// ============================================================================

const SECTION_CONFIG = {
  PINNED: {
    id: 'PINNED',
    title: 'Favorite Cards',
    icon: StarIcon,
  },
  BURNER: {
    id: 'BURNER',
    title: 'Burner Cards',
    icon: FireIcon,
  },
  MERCHANT: {
    id: 'MERCHANT',
    title: 'Merchant-Locked Cards',
    icon: BuildingStorefrontIcon,
  },
  CATEGORY: {
    id: 'CATEGORY',
    title: 'Category-Locked Cards',
    icon: TagIcon,
  },
  LOCATION: {
    id: 'LOCATION',
    title: 'Location-Locked Cards',
    icon: MapPinIcon,
  },
};

// ============================================================================
// Utility Components
// ============================================================================

function StatCard({ icon: Icon, iconColor, label, value, dotColor }) {
  const colors = useColors();
  return (
    <Card f={1} bg={colors.backgroundSecondary} p="$4" br="$5" gap="$1">
      <XStack ai="center" gap="$2" mb="$1">
        {dotColor ? <View w={12} h={12} br="$6" bg={dotColor} /> : <Icon size={12} color={iconColor} />}
        <Text color={colors.textSecondary} fontSize="$3">
          {label}
        </Text>
      </XStack>
      <Text color={colors.text} fontSize="$5" fontWeight="700">
        {value}
      </Text>
    </Card>
  );
}

// ============================================================================
// Feature Components
// ============================================================================

function UserGreeting() {
  const colors = useColors();
  return (
    // <XStack ai="center" mb="$2" gap="$3">
    //   <Avatar circular size="$6">
    //     <Avatar.Image
    //       source={{
    //         uri: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
    //       }}
    //     />
    //     <Avatar.Fallback backgroundColor={colors.backgroundSecondary} />
    //   </Avatar>
    //   <XStack>
    //     <Text color={colors.text} fontSize="$7" fontFamily="$archivoBlack">
    //       Hi,{' '}
    //     </Text>
    //     <Text color={colors.primary} fontSize="$7" fontFamily="$archivoBlack">
    //       {user.name.split(' ')[0]}
    //     </Text>
    //   </XStack>
    // </XStack>
    <></>
  );
}

function SpendingStats() {
  const colors = useColors();
  const { user } = useUser();
  return (
    <YStack gap="$3" mb="$2" px={16}>
      <XStack ai="center" mb="$2" gap="$2">
        <BanknotesIcon size={20} color={colors.text} />
        <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
          Spending Overview
        </Text>
      </XStack>
      <XStack gap="$3">
        <Card f={1} bg={colors.card} p="$4" br={12} borderWidth={1} borderColor={colors.border}>
          <Text color={colors.textSecondary} fontSize="$3" mb="$2">
            Today
          </Text>
          <Text color={colors.text} fontSize="$5" fontWeight="700">
            {formatCurrency(user?.currentDailySpend || 0)}
          </Text>
        </Card>
        <Card f={1} bg={colors.card} p="$4" br={12} borderWidth={1} borderColor={colors.border}>
          <Text color={colors.textSecondary} fontSize="$3" mb="$2">
            This Month
          </Text>
          <Text color={colors.text} fontSize="$5" fontWeight="700">
            {formatCurrency(user?.currentMonthlySpend || 0)}
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
    //     <CreditCardIcon size={20} color={getColors().text} />
    //     <Text color={getColors().text} fontSize="$4" fontFamily="$archivoBlack">
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
      <UserGreeting />
      <SpendingStats />
      {/* <CardStats /> */}
    </YStack>
  );
}

function CustomizeButton({ onPress }) {
  const colors = useColors();
  return (
    <XStack>
      <Button
        f={1}
        size="$5"
        bg={colors.card}
        pressStyle={{ bg: colors.backgroundTertiary }}
        onPress={onPress}
        marginHorizontal={16}
        icon={<AdjustmentsHorizontalIcon size={20} color={colors.text} />}
        br={12}
        borderWidth={1}
        borderColor={colors.border}
      >
        <Text color={colors.text} fontWeight="700">
          Customize
        </Text>
      </Button>
    </XStack>
  );
}

function ReorganizeSheet({ isOpen, onOpenChange, sections, onReorder, onReset }) {
  const colors = useColors();
  return (
    <BottomSheet isOpen={isOpen} onClose={onOpenChange} enableContentPanningGesture={false}>
      <YStack px="$4" pt="$5" pb="$10">
        <XStack jc="space-between" ai="center" mb="$3">
          <Text color={colors.text} fontSize="$6" fontFamily="$archivoBlack">
            Customize
          </Text>
          <XStack gap="$2">
            <Button size="$3" bg="transparent" pressStyle={{ bg: colors.backgroundTertiary }} onPress={onReset}>
              <Text color={colors.textSecondary}>Reset</Text>
            </Button>
            <Button
              size="$3"
              bg={colors.backgroundSecondary}
              pressStyle={{ bg: colors.backgroundTertiary }}
              onPress={() => onOpenChange(false)}
            >
              <Text color={colors.text}>Done</Text>
            </Button>
          </XStack>
        </XStack>
        <View backgroundColor={colors.background}>
          <DraggableList sections={sections} onReorder={onReorder} />
        </View>
      </YStack>
    </BottomSheet>
  );
}

// ============================================================================
// Main Screen Component
// ============================================================================

function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cardsByType, getCardDisplayData, isLoading: isCardsLoading, refetch: refetchCards, searchCards } = useCards();
  const { order, isLoading: isSectionOrderLoading, saveOrder, resetOrder } = useSectionOrder();
  const [isReorganizing, setIsReorganizing] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const searchListRef = useRef(null);
  const { insights, isLoading: isAILoading, error: aiError, fetchInsights } = useAIInsights();
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const { currentPlan } = usePlans();
  const isPremium = currentPlan === 'PREMIUM';

  // Mock spending data - replace with real data from your API
  const spendingData = {
    totalSpent: 25000,
    biggestMonth: 'December',
    biggestMonthAmount: 4500,
    highestPurchase: 1200,
    highestPurchaseMerchant: 'Apple Store',
    topMerchant: 'Starbucks',
    topMerchantVisits: 45,
    topLocation: 'Dubai Mall',
    topLocationAmount: 8500,
    topCategory: 'Shopping',
    topCategoryAmount: 12000,
  };

  // Get all pinned cards across all types
  const pinnedCards = useMemo(() => {
    const allPinnedCards = [];
    Object.values(cardsByType).forEach((cards) => {
      cards.forEach((card) => {
        if (card.pinned) {
          allPinnedCards.push(card);
        }
      });
    });
    return allPinnedCards.map(getCardDisplayData);
  }, [cardsByType, getCardDisplayData]);

  // Filter sections based on plan type
  const sections = useMemo(() => {
    return order
      .filter((sectionId) => {
        // Hide location and category sections for basic users
        if (!isPremium && (sectionId === 'LOCATION' || sectionId === 'CATEGORY')) {
          return false;
        }
        return true;
      })
      .map((sectionId) => {
        const sectionCards = cardsByType[sectionId] || [];

        return {
          ...SECTION_CONFIG[sectionId],
          data: sectionCards
            .sort((a, b) => {
              // First sort by pin status
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;

              // Then sort by card status
              const getPriority = (card) => {
                if (card.closed) return 2;
                if (card.paused) return 1;
                return 0;
              };
              return getPriority(a) - getPriority(b);
            })
            .map(getCardDisplayData),
        };
      });
  }, [order, cardsByType, getCardDisplayData, isPremium]);

  const handleReorder = async (reorderedSections) => {
    const newOrder = reorderedSections.map((section) => section.id);
    await saveOrder(newOrder);
  };

  // Handle search
  const handleSearch = useCallback(
    (query) => {
      setSearchText(query);
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchResults(searchCards(query));
    },
    [searchCards]
  );

  // Add refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchCards(),
        // Add any other data refetch calls here
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchCards]);

  // Set up navigation options with search button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowSearch(!showSearch)}
          style={{
            marginRight: 8,
            backgroundColor: showSearch ? colors.backgroundSecondary : 'transparent',
            padding: 8,
            borderRadius: 8,
          }}
        >
          <MagnifyingGlassIcon size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.text, showSearch]);

  const handleShowInsights = async () => {
    setIsInsightsOpen(true);
    try {
      const transactions = await fetchUserTransactions();
      await fetchInsights(transactions);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const isLoading = isCardsLoading || isSectionOrderLoading;
  if (isLoading) {
    return (
      <View f={1} ai="center" jc="center" bg={colors.background}>
        <Spinner size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <>
      {showSearch && <SearchBar onSearch={handleSearch} searchText={searchText} placeholder="Search cards" />}
      {showSearch ? (
        <SearchView
          searchResults={searchResults}
          searchText={searchText}
          listRef={searchListRef}
          renderItem={({ item }) => <CompactCardComponent item={item} />}
          emptyMessage="Try searching for a different card or merchant."
          searchTerm="card"
        />
      ) : (
        <ScrollView
          f={1}
          contentContainerStyle={{
            paddingTop: 24,
            paddingBottom: insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.text}
              colors={[colors.primary]}
              progressBackgroundColor={colors.backgroundSecondary}
              progressViewOffset={10}
            />
          }
        >
          <SpendingRecapButton onPress={() => setShowRecap(true)} />
          <AIInsightsButton onPress={handleShowInsights} />

          <SpendingSummary />

          {/* Pinned Cards Section */}
          {pinnedCards.length > 0 && (
            <CardCarousel
              key="pinned"
              title={SECTION_CONFIG.PINNED.title}
              data={pinnedCards}
              icon={SECTION_CONFIG.PINNED.icon}
            />
          )}

          {/* Regular Sections */}
          {sections.map((section) => (
            <CardCarousel key={section.id} title={section.title} data={section.data} icon={section.icon} />
          ))}

          <CustomizeButton onPress={() => setIsReorganizing(true)} />

          {/* Absolute Positioned Components */}
          <>
            <ReorganizeSheet
              isOpen={isReorganizing}
              onOpenChange={setIsReorganizing}
              sections={sections}
              onReorder={handleReorder}
              onReset={resetOrder}
            />
            <SpendingRecapStory isVisible={showRecap} onClose={() => setShowRecap(false)} spendingData={spendingData} />
            <AIInsightsSheet
              isOpen={isInsightsOpen}
              onClose={() => setIsInsightsOpen(false)}
              insights={insights}
              isLoading={isAILoading}
            />
          </>
        </ScrollView>
      )}
    </>
  );
}

export default HomeScreen;
