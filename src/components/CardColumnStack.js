import { Colors, useColors } from '@/context/ColorSchemeContext';
import { StatusBar } from 'expo-status-bar';
import { View, Text, YStack } from 'tamagui';
import Animated, { useAnimatedStyle, interpolate, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image, Dimensions, Pressable, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const WINDOW_HEIGHT = window.height;
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);

const CARD_OFFSET = 100;
const TOP_PADDING = Platform.OS === 'ios' ? 120 : 100;
const BOTTOM_PADDING = 120;
const HEADER_HEIGHT = 100;
const SEPARATION_OFFSET = WINDOW_HEIGHT / 3;

const DUMMY_DATA = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: `card${index}`,
    image: require('../../assets/cards/card1-front.png'),
  }));

const CreditCard = ({ item, index, scrollY, totalLength, onPress }) => {
  const colors = useColors();
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      Math.max(0, (index - 2) * CARD_OFFSET - SEPARATION_OFFSET),
      Math.max(0, (index - 1) * CARD_OFFSET - SEPARATION_OFFSET),
      Math.max(0, index * CARD_OFFSET - SEPARATION_OFFSET),
    ];
    const translateY = interpolate(scrollY.value, inputRange, [0, 0, -CARD_OFFSET], 'clamp');

    // Create a smooth initial scroll transition
    const initialScrollProgress = interpolate(scrollY.value, [0, CARD_OFFSET], [0, 1], 'clamp');

    return {
      transform: [{ translateY: translateY * initialScrollProgress }],
      zIndex: totalLength - index,
    };
  });

  return (
    <Pressable
      onPress={() => onPress(item, index)}
      style={{
        position: 'absolute',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        top: index * CARD_OFFSET,
      }}
    >
      <Animated.View
        sharedTransitionTag={`card-${item.id}`}
        style={[
          {
            width: '100%',
            height: '100%',
            borderRadius: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            backgroundColor: colors.background,
          },
          animatedStyle,
        ]}
      >
        <Image
          source={item.image}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
            resizeMode: 'cover',
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

const ActivityScreen = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const scrollY = useSharedValue(0);

  const handleScroll = useCallback((event) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  }, []);

  const handleCardPress = useCallback(
    (card, index) => {
      navigation.navigate(Paths.CARD_DETAILS, { card, index });
    },
    [navigation]
  );

  const contentHeight = CARD_OFFSET * (DUMMY_DATA.length - 1) + CARD_HEIGHT + TOP_PADDING + BOTTOM_PADDING;

  return (
    <View f={1} bg={colors.background}>
      <YStack f={1} ai="center">
        <View f={1} w="100%" ai="center">
          <View width={CARD_WIDTH} height={WINDOW_HEIGHT}>
            <ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{
                height: contentHeight,
                paddingTop: TOP_PADDING,
                paddingBottom: BOTTOM_PADDING,
                marginTop: HEADER_HEIGHT + 10,
              }}
              showsVerticalScrollIndicator={false}
            >
              {DUMMY_DATA.map((item, index) => (
                <CreditCard
                  key={`${item.id}-${index}`}
                  item={item}
                  index={index}
                  scrollY={scrollY}
                  totalLength={DUMMY_DATA.length}
                  onPress={handleCardPress}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </YStack>
      <StatusBar style="light" />
    </View>
  );
};

export default ActivityScreen;
