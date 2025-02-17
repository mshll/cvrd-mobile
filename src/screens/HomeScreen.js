import * as React from 'react';
import { useColors, Colors } from '@/context/ColorSchemeContext';
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
  ListBulletIcon,
  Squares2X2Icon,
  SparklesIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from 'react-native-heroicons/solid';
import { AIInsightsButton } from '@/components/AIInsightsButton';
import { AIInsightsSheet } from '@/components/AIInsightsSheet';
import { useAIInsights } from '@/hooks/useAIInsights';
import { fetchUserTransactions } from '@/api/transactions';
import { StyleSheet, Linking, Image, Animated } from 'react-native';
import { CARD_HEIGHT, CARD_WIDTH } from '@/utils/cardUtils';
import { Paths } from '@/navigation/paths';
import { getCardViewMode, setCardViewMode } from '@/utils/storage';
import { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

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

const VIEW_MODES = {
  CAROUSEL: 'carousel',
  LIST: 'list',
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

  return <></>;
}

function CompactCardList({ section }) {
  const colors = useColors();
  const Icon = section.icon;

  if (!section.data?.length) return null;

  return (
    <YStack gap="$2" mb="$8" px="$4">
      <XStack ai="center" gap="$2" mb="$3">
        <Icon size={20} color={colors.text} />
        <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
          {section.title}
        </Text>
      </XStack>
      <YStack gap="$3">
        {section.data.map((card) => (
          <CompactCardComponent key={card.id} item={card} showTypeBadge={false} />
        ))}
      </YStack>
    </YStack>
  );
}

function Header({ viewMode, onToggleViewMode, cardFilter, onFilterChange }) {
  const colors = useColors();
  const { cards } = useCards();

  return (
    <YStack my="$4" gap="$4">
      <UserGreeting />
      <SpendingStats />
      <XStack px="$4" jc="space-between" ai="center">
        {/* Filter Badges */}
        <XStack gap="$2">
          <Button
            size="$2"
            backgroundColor={cardFilter === 'all' ? colors.primary : colors.backgroundSecondary}
            pressStyle={{ backgroundColor: cardFilter === 'all' ? colors.primaryDark : colors.backgroundTertiary }}
            borderRadius={20}
            borderWidth={1}
            borderColor={cardFilter === 'all' ? colors.primary : colors.border}
            onPress={() => onFilterChange('all')}
            px="$3"
          >
            <Text color={cardFilter === 'all' ? 'white' : colors.text} fontSize="$2" fontWeight="600">
              All
            </Text>
          </Button>
          <Button
            size="$2"
            backgroundColor={cardFilter === 'active' ? colors.success : colors.backgroundSecondary}
            pressStyle={{
              backgroundColor: cardFilter === 'active' ? `${colors.success}CC` : colors.backgroundTertiary,
            }}
            borderRadius={20}
            borderWidth={1}
            borderColor={cardFilter === 'active' ? colors.success : colors.border}
            onPress={() => onFilterChange('active')}
            px="$3"
          >
            <Text color={cardFilter === 'active' ? 'white' : colors.text} fontSize="$2" fontWeight="600">
              Active
            </Text>
          </Button>
          <Button
            size="$2"
            backgroundColor={cardFilter === 'paused' ? colors.warning : colors.backgroundSecondary}
            pressStyle={{
              backgroundColor: cardFilter === 'paused' ? `${colors.warning}CC` : colors.backgroundTertiary,
            }}
            borderRadius={20}
            borderWidth={1}
            borderColor={cardFilter === 'paused' ? colors.warning : colors.border}
            onPress={() => onFilterChange('paused')}
            px="$3"
          >
            <Text color={cardFilter === 'paused' ? 'black' : colors.text} fontSize="$2" fontWeight="600">
              Paused
            </Text>
          </Button>
          <Button
            size="$2"
            backgroundColor={cardFilter === 'closed' ? colors.danger : colors.backgroundSecondary}
            pressStyle={{
              backgroundColor: cardFilter === 'closed' ? `${colors.danger}CC` : colors.backgroundTertiary,
            }}
            borderRadius={20}
            borderWidth={1}
            borderColor={cardFilter === 'closed' ? colors.danger : colors.border}
            onPress={() => onFilterChange('closed')}
            px="$3"
          >
            <Text color={cardFilter === 'closed' ? 'white' : colors.text} fontSize="$2" fontWeight="600">
              Closed
            </Text>
          </Button>
        </XStack>

        {/* View Mode Toggle */}
        <Button
          size="$3"
          backgroundColor={colors.backgroundSecondary}
          pressStyle={{ backgroundColor: colors.backgroundTertiary }}
          borderRadius={8}
          borderWidth={1}
          borderColor={colors.border}
          onPress={onToggleViewMode}
        >
          {viewMode === VIEW_MODES.CAROUSEL ? (
            <ListBulletIcon size={20} color={colors.text} />
          ) : (
            <Squares2X2Icon size={20} color={colors.text} />
          )}
        </Button>
      </XStack>
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

// Add Skeleton Components
const CardCarouselSkeleton = () => {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View w="100%" mb="$7" gap="$4">
      <XStack ai="center" mb="$2" gap="$2" px="$4">
        <Animated.View
          style={[
            {
              width: 120,
              height: 24,
              borderRadius: 6,
              backgroundColor: colors.backgroundTertiary,
              opacity: fadeAnim,
            },
          ]}
        />
      </XStack>
      <View w="100%" h={CARD_HEIGHT * 0.9} ai="center">
        <Animated.View
          style={[
            {
              width: CARD_WIDTH * 0.9,
              height: CARD_HEIGHT * 0.9,
              borderRadius: 16,
              backgroundColor: colors.backgroundTertiary,
              opacity: fadeAnim,
            },
          ]}
        />
      </View>
    </View>
  );
};

const SpendingStatsSkeleton = () => {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <YStack gap="$3" mb="$2" px={16}>
      <XStack ai="center" mb="$2" gap="$2">
        <Animated.View
          style={[
            {
              width: 150,
              height: 24,
              borderRadius: 6,
              backgroundColor: colors.backgroundTertiary,
              opacity: fadeAnim,
            },
          ]}
        />
      </XStack>
      <XStack gap="$3">
        {[1, 2].map((i) => (
          <Card key={i} f={1} bg={colors.card} p="$4" br={12} borderWidth={1} borderColor={colors.border}>
            <Animated.View
              style={[
                {
                  width: 80,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: colors.backgroundTertiary,
                  marginBottom: 8,
                  opacity: fadeAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                {
                  width: 100,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: colors.backgroundTertiary,
                  opacity: fadeAnim,
                },
              ]}
            />
          </Card>
        ))}
      </XStack>
    </YStack>
  );
};

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
  const [viewMode, setViewMode] = useState(VIEW_MODES.CAROUSEL);
  const [contentVisible, setContentVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const [cardFilter, setCardFilter] = useState('all');
  const [showInsights, setShowInsights] = useState(false);
  const insightsHeight = useRef(new Animated.Value(0)).current;
  const insightsOpacity = useRef(new Animated.Value(0)).current;

  // Animate content on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setContentVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 15,
          mass: 1,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Load saved view mode preference
  useEffect(() => {
    const loadViewMode = async () => {
      const savedMode = await getCardViewMode();
      setViewMode(savedMode);
    };
    loadViewMode();
  }, []);

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

  const sections = useMemo(() => {
    return order.map((sectionId) => {
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
  }, [order, cardsByType, getCardDisplayData]);

  // Filter cards based on selected filter
  const filteredSections = useMemo(() => {
    return sections.map((section) => {
      const filteredData = section.data.filter((card) => {
        switch (cardFilter) {
          case 'active':
            return !card.isClosed && !card.isPaused;
          case 'paused':
            return card.isPaused && !card.isClosed;
          case 'closed':
            return card.isClosed;
          default:
            return true;
        }
      });
      return { ...section, data: filteredData };
    });
  }, [sections, cardFilter]);

  // Filter pinned cards
  const filteredPinnedCards = useMemo(() => {
    return pinnedCards.filter((card) => {
      switch (cardFilter) {
        case 'active':
          return !card.isClosed && !card.isPaused;
        case 'paused':
          return card.isPaused && !card.isClosed;
        case 'closed':
          return card.isClosed;
        default:
          return true;
      }
    });
  }, [pinnedCards, cardFilter]);

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
      console.log('Error refreshing data:', error);
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
      console.log('Error fetching insights:', error);
    }
  };

  const handleToggleViewMode = useCallback(async () => {
    const newMode = viewMode === VIEW_MODES.CAROUSEL ? VIEW_MODES.LIST : VIEW_MODES.CAROUSEL;
    setViewMode(newMode);
    await setCardViewMode(newMode);
  }, [viewMode]);

  const isLoading = isCardsLoading || isSectionOrderLoading;
  if (isLoading) {
    return (
      <ScrollView
        f={1}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SpendingStatsSkeleton />
        {[1, 2, 3].map((i) => (
          <CardCarouselSkeleton key={i} />
        ))}
      </ScrollView>
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
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY }],
            }}
          >
            <YStack gap="$2" mb="$4">
              <XStack ai="center" jc="space-between" px="$4">
                <XStack ai="center" gap="$2">
                  <SparklesIcon size={20} color={colors.text} />
                  <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
                    Insights
                  </Text>
                </XStack>
                <Button
                  size="$3"
                  backgroundColor={colors.backgroundSecondary}
                  pressStyle={{ backgroundColor: colors.backgroundTertiary }}
                  onPress={() => {
                    Animated.parallel([
                      Animated.spring(insightsHeight, {
                        toValue: showInsights ? 0 : 1,
                        useNativeDriver: false,
                        damping: 15,
                        mass: 1,
                        stiffness: 100,
                      }),
                      Animated.spring(insightsOpacity, {
                        toValue: showInsights ? 0 : 1,
                        useNativeDriver: false,
                        damping: 15,
                        mass: 1,
                        stiffness: 100,
                      }),
                    ]).start();
                    setShowInsights(!showInsights);
                  }}
                  borderWidth={1}
                  borderColor={colors.border}
                  br={8}
                  px="$3"
                >
                  <XStack ai="center" gap="$2">
                    <Text color={colors.text} fontSize="$2" fontWeight="600">
                      {showInsights ? 'Hide' : 'Show'}
                    </Text>
                    {showInsights ? (
                      <ChevronUpIcon size={16} color={colors.text} />
                    ) : (
                      <ChevronDownIcon size={16} color={colors.text} />
                    )}
                  </XStack>
                </Button>
              </XStack>

              <Animated.View
                style={{
                  maxHeight: insightsHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 250], // Adjust this value based on your content height
                  }),
                  opacity: insightsOpacity,
                  overflow: 'hidden',
                }}
              >
                <SpendingRecapButton onPress={() => setShowRecap(true)} />
                <AIInsightsButton onPress={handleShowInsights} />
              </Animated.View>
            </YStack>

            <Header
              viewMode={viewMode}
              onToggleViewMode={handleToggleViewMode}
              cardFilter={cardFilter}
              onFilterChange={setCardFilter}
            />

            {/* Pinned Cards Section */}
            {filteredPinnedCards.length > 0 &&
              (viewMode === VIEW_MODES.CAROUSEL ? (
                <CardCarousel
                  key="pinned"
                  title={SECTION_CONFIG.PINNED.title}
                  data={filteredPinnedCards}
                  icon={SECTION_CONFIG.PINNED.icon}
                />
              ) : (
                <CompactCardList
                  section={{
                    ...SECTION_CONFIG.PINNED,
                    data: filteredPinnedCards,
                  }}
                />
              ))}

            {/* Regular Sections */}
            {filteredSections.map((section) =>
              viewMode === VIEW_MODES.CAROUSEL ? (
                <CardCarousel key={section.id} title={section.title} data={section.data} icon={section.icon} />
              ) : (
                <CompactCardList key={section.id} section={section} />
              )
            )}

            <CustomizeButton onPress={() => setIsReorganizing(true)} />
          </Animated.View>

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
