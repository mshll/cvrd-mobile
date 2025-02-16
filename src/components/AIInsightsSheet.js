import React, { useEffect } from 'react';
import { ScrollView, View, Animated as RNAnimated, Dimensions } from 'react-native';
import { Text, YStack, XStack, Card } from 'tamagui';
import { useColors, Colors } from '@/context/ColorSchemeContext';
import BottomSheet from '@/components/BottomSheet';
import {
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  TagIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useAIInsights } from '@/hooks/useAIInsights';
import { fetchUserTransactions } from '@/api/transactions';

const AnimatedCard = Animated.createAnimatedComponent(Card);
const windowWidth = Dimensions.get('window').width;

// Skeleton loader component
const SkeletonLoader = ({ children, style }) => {
  const colors = useColors();
  const animatedValue = new RNAnimated.Value(0);

  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <RNAnimated.View
      style={[
        {
          opacity,
          backgroundColor: colors.backgroundTertiary,
          borderRadius: 12,
        },
        style,
      ]}
    >
      {children}
    </RNAnimated.View>
  );
};

// Skeleton section component
const SkeletonSection = ({ type = 'card', delay = 0 }) => {
  const colors = useColors();

  if (type === 'chart') {
    return (
      <Card bg={colors.backgroundSecondary} mb="$4" p="$4" br={12} animation="quick">
        <XStack ai="center" gap="$2" mb="$4">
          <SkeletonLoader style={{ width: 24, height: 24, borderRadius: 12 }}>
            <View f={1} />
          </SkeletonLoader>
          <SkeletonLoader style={{ width: 140, height: 24, borderRadius: 6 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>
        <SkeletonLoader style={{ width: '100%', height: 200, borderRadius: 12 }}>
          <View f={1} />
        </SkeletonLoader>
      </Card>
    );
  }

  if (type === 'ranked-list') {
    return (
      <Card bg="transparent" mb="$4" animation="quick">
        <XStack ai="center" gap="$2" mb="$3" px="$2">
          <SkeletonLoader style={{ width: 24, height: 24, borderRadius: 12 }}>
            <View f={1} />
          </SkeletonLoader>
          <SkeletonLoader style={{ width: 140, height: 24, borderRadius: 6 }}>
            <View f={1} />
          </SkeletonLoader>
        </XStack>
        <Card bg={colors.backgroundSecondary} p="$4" br={12}>
          <YStack gap="$3">
            {[1, 2, 3, 4, 5].map((item) => (
              <XStack key={item} ai="center" jc="space-between">
                <XStack ai="center" gap="$2" f={1}>
                  <SkeletonLoader style={{ width: 24, height: 24, borderRadius: 12 }}>
                    <View f={1} />
                  </SkeletonLoader>
                  <SkeletonLoader style={{ width: '60%', height: 20, borderRadius: 6 }}>
                    <View f={1} />
                  </SkeletonLoader>
                </XStack>
                <SkeletonLoader style={{ width: 80, height: 20, borderRadius: 6 }}>
                  <View f={1} />
                </SkeletonLoader>
              </XStack>
            ))}
          </YStack>
        </Card>
      </Card>
    );
  }

  return (
    <Card bg="transparent" mb="$4" animation="quick">
      <XStack ai="center" gap="$2" mb="$3" px="$2">
        <SkeletonLoader style={{ width: 24, height: 24, borderRadius: 12 }}>
          <View f={1} />
        </SkeletonLoader>
        <SkeletonLoader style={{ width: 140, height: 24, borderRadius: 6 }}>
          <View f={1} />
        </SkeletonLoader>
      </XStack>
      <YStack gap="$3">
        {[1, 2, 3].map((item) => (
          <Card key={item} bg={colors.backgroundSecondary} p="$4" br={12}>
            <YStack gap="$2">
              <SkeletonLoader style={{ width: '100%', height: 24, borderRadius: 6 }}>
                <View f={1} />
              </SkeletonLoader>
              <SkeletonLoader style={{ width: '80%', height: 16, borderRadius: 6 }}>
                <View f={1} />
              </SkeletonLoader>
            </YStack>
          </Card>
        ))}
      </YStack>
    </Card>
  );
};

function InsightCard({ title, value, subtitle, icon: Icon, simplified = false }) {
  const colors = useColors();
  return (
    <Card f={1} bg={colors.card} p="$4" br={12} borderWidth={1} borderColor={colors.border}>
      {!simplified && (
        <XStack ai="center" gap="$2" mb="$2">
          <Icon size={20} color={colors.primary} />
          <Text color={colors.textSecondary} fontSize="$3">
            {title}
          </Text>
        </XStack>
      )}
      <Text color={colors.text} fontSize="$5" fontWeight="700" mb={subtitle ? '$1' : undefined}>
        {value}
      </Text>
      {subtitle && (
        <Text color={colors.textSecondary} fontSize="$2">
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

function InsightSection({ title, items, icon: Icon, delay = 0 }) {
  const colors = useColors();

  if (!items || items.length === 0) return null;

  const isSimplifiedSection = title === 'Potential Savings' || title === 'Subscription Analysis';
  const getIconForInsight = (insight) => {
    if (title === 'Overview') {
      if (insight.title.includes('Most Used')) return BuildingStorefrontIcon;
      if (insight.title.includes('Category')) return TagIcon;
      if (insight.title.includes('Recurring')) return ArrowPathIcon;
      return ChartBarIcon;
    }
    return Icon;
  };

  return (
    <AnimatedCard entering={FadeInDown.delay(delay).springify()} exiting={FadeOut} bg="transparent" mb="$4">
      <XStack ai="center" gap="$2" mb="$3" px="$2">
        <Icon size={20} color={colors.primary} />
        <Text color={colors.text} fontSize="$5" fontWeight="600">
          {title}
        </Text>
      </XStack>
      <YStack gap="$3">
        {items.map((item, index) => (
          <InsightCard
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={getIconForInsight(item)}
            simplified={isSimplifiedSection}
          />
        ))}
      </YStack>
    </AnimatedCard>
  );
}

function ChartSection({ data, title, icon: Icon, type, delay = 0 }) {
  const colors = useColors();
  const chartWidth = windowWidth - 100; // Increased padding from 64 to 80

  if (!data || data.length === 0) return null;

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) =>
      colors.primary +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0'),
    labelColor: () => colors.text,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: type === 'pie' ? 1 : 0,
    propsForLabels: {
      fontSize: 12,
    },
  };

  if (type === 'ranked-list') {
    return (
      <AnimatedCard entering={FadeInDown.delay(delay).springify()} exiting={FadeOut} bg="transparent" mb="$4">
        <XStack ai="center" gap="$2" mb="$3" px="$2">
          <Icon size={20} color={colors.primary} />
          <Text color={colors.text} fontSize="$5" fontWeight="600">
            {title}
          </Text>
        </XStack>
        <Card bg={colors.card} p="$4" br={12} borderWidth={1} borderColor={colors.border}>
          <YStack gap="$3">
            {data.map((item, index) => (
              <XStack key={index} ai="center" jc="space-between">
                <XStack ai="center" gap="$2" f={1}>
                  <Text color={colors.white} fontSize="$5" fontWeight="700">
                    #{index + 1}
                  </Text>
                  <Text color={colors.text} fontSize="$4" numberOfLines={1} f={1}>
                    {item.x}
                  </Text>
                </XStack>
                <Text color={colors.text} fontSize="$4" fontWeight="600">
                  KWD {item.y.toFixed(2)}
                </Text>
              </XStack>
            ))}
          </YStack>
        </Card>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard
      entering={FadeInDown.delay(delay).springify()}
      exiting={FadeOut}
      bg={colors.card}
      mb="$4"
      p="$4"
      br={16}
      borderWidth={1}
      borderColor={colors.border}
    >
      <XStack ai="center" gap="$2" mb="$3">
        <Icon size={20} color={colors.primary} />
        <Text color={colors.text} fontSize="$5" fontWeight="600">
          {title}
        </Text>
      </XStack>

      {type === 'pie' ? (
        <PieChart
          data={data.map((item, index) => ({
            name: item.x,
            amount: item.y,
            color: [Colors.cards.blue, Colors.cards.pink, Colors.cards.green, Colors.cards.yellow, Colors.cards.red][
              index
            ],
            legendFontColor: colors.text,
          }))}
          width={chartWidth}
          height={200}
          chartConfig={{
            ...chartConfig,
            decimalPlaces: 0,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={true}
          avoidFalseZero
          yAxisLabel="%"
        />
      ) : (
        <BarChart
          data={{
            labels: data.map((d) => d.x),
            datasets: [
              {
                data: data.map((d) => d.y),
              },
            ],
          }}
          width={chartWidth}
          height={280}
          chartConfig={{
            ...chartConfig,
            propsForHorizontalLabels: {
              fontSize: 12,
              rotation: 0,
              fontWeight: '500',
            },
            propsForVerticalLabels: {
              fontSize: 12,
            },
            formatYLabel: (value) => {
              // Round to nearest 10
              return (Math.round(value / 10) * 10).toString();
            },
            count: 5,
            // Ensure y-axis starts at 0 and segments in multiples of 10
            segment: 10,
          }}
          style={{
            marginTop: 20,
            borderRadius: 16,
          }}
          showValuesOnTopOfBars
          fromZero
          withInnerLines={false}
          showBarTops={false}
          flatColor
        />
      )}
    </AnimatedCard>
  );
}

export function AIInsightsSheet({ isOpen, onClose }) {
  const colors = useColors();
  const scrollViewRef = React.useRef(null);
  const { insights, isLoading, error, fetchInsights } = useAIInsights();
  const [hasLoaded, setHasLoaded] = React.useState(false);

  useEffect(() => {
    async function loadInsights() {
      if (isOpen && !hasLoaded && !isLoading) {
        try {
          setHasLoaded(true);
          const transactions = await fetchUserTransactions();
          await fetchInsights(transactions);
        } catch (error) {
          console.error('Error fetching insights:', error);
        }
      }
    }
    loadInsights();
  }, [isOpen, hasLoaded, isLoading, fetchInsights]);

  // Reset hasLoaded when sheet is closed
  useEffect(() => {
    if (!isOpen) {
      setHasLoaded(false);
    }
  }, [isOpen]);

  if (!insights && !isLoading) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={['85%']}
      initialSnap={0}
      animateToPosition={0}
      enablePanDownToClose
      enableContentPanningGesture
    >
      <YStack px="$4" pt="$4" pb="$15" f={1}>
        {/* <AnimatedCard
          entering={FadeInDown.springify()}
          bg={colors.card}
          mb="$4"
          p="$4"
          br={16}
          borderWidth={1}
          borderColor={colors.border}
        >
          <Text color={colors.text} fontSize="$6" fontWeight="700" textAlign="center">
            AI Spending Analysis
          </Text>
        </AnimatedCard> */}

        {isLoading ? (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            bounces={false}
            scrollEventThrottle={16}
          >
            <SkeletonSection delay={100} />
            <SkeletonSection type="chart" delay={200} />
            <SkeletonSection type="chart" delay={300} />
            <SkeletonSection type="ranked-list" delay={400} />
            <SkeletonSection delay={500} />
            <SkeletonSection delay={600} />
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            bounces={false}
            scrollEventThrottle={16}
          >
            <InsightSection title="Overview" items={insights?.overview} icon={ChartBarIcon} delay={100} />

            <ChartSection
              title="Category Breakdown (%)"
              data={insights?.chartData?.categoryBreakdown}
              icon={ArrowTrendingUpIcon}
              type="pie"
              delay={200}
            />

            <ChartSection
              title="Weekly Spending"
              data={insights?.chartData?.weeklySpending}
              icon={CalendarIcon}
              type="bar"
              delay={300}
            />

            <ChartSection
              title="Top Recurring Expenses"
              data={insights?.chartData?.recurringSpending}
              icon={BuildingStorefrontIcon}
              type="ranked-list"
              delay={400}
            />

            <InsightSection title="Potential Savings" items={insights?.savings} icon={BanknotesIcon} delay={500} />

            <InsightSection
              title="Subscription Analysis"
              items={insights?.subscriptionAdvice}
              icon={ClockIcon}
              delay={600}
            />
          </ScrollView>
        )}
      </YStack>
    </BottomSheet>
  );
}
