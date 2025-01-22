import * as React from 'react';
import { Dimensions, View, StyleSheet, Pressable, Animated } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../config/colors';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '../navigation/paths';
import { Text } from 'tamagui';
import CardComponent from './CardComponent';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const CARD_ASPECT_RATIO = 1630 / 1024;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);
const SPACING = 2;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const SIDE_SPACING = (WINDOW_WIDTH - CARD_WIDTH) / 2;
const SNAP_OFFSET = SIDE_SPACING - SPACING;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

function CardCarousel({ title, data, icon: Icon }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flashListRef = React.useRef(null);

  const handleCardPress = React.useCallback(
    (item, index) => {
      navigation.navigate(Paths.CARD_DETAILS, {
        card: item,
        index,
      });
    },
    [navigation]
  );

  const getItemType = React.useCallback(() => {
    return 'card';
  }, []);

  const onScrollEnd = React.useCallback((event) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round((position - SNAP_OFFSET) / ITEM_WIDTH);

    if (flashListRef.current) {
      flashListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, []);

  const renderItem = React.useCallback(
    ({ item, index }) => {
      const inputRange = [(index - 1) * ITEM_WIDTH + SNAP_OFFSET, index * ITEM_WIDTH + SNAP_OFFSET, (index + 1) * ITEM_WIDTH + SNAP_OFFSET];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp',
      });

      return (
        <Pressable onPress={() => handleCardPress(item, index)} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [{ scale }],
                marginHorizontal: SPACING,
              },
            ]}
          >
            <CardComponent type={item.type} label={item.label} emoji={item.emoji} lastFourDigits={item.lastFourDigits} color={item.backgroundColor} />
          </Animated.View>
        </Pressable>
      );
    },
    [handleCardPress, scrollX]
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        {Icon && <Icon size={18} color={colors.text} />}
        <Text fontSize="$3" fontWeight="700" color={colors.text} marginLeft={Icon ? 6 : 0}>
          {title}
        </Text>
      </View>
      <View style={[styles.carouselContainer, { height: CARD_HEIGHT }]}>
        <AnimatedFlashList
          ref={flashListRef}
          data={data}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={styles.contentContainer}
          estimatedItemSize={ITEM_WIDTH}
          estimatedListSize={{ width: WINDOW_WIDTH, height: CARD_HEIGHT }}
          getItemType={getItemType}
          drawDistance={ITEM_WIDTH * 2}
          overrideItemLayout={(layout, item, index) => {
            layout.size = ITEM_WIDTH;
            layout.offset = index * ITEM_WIDTH;
          }}
          initialScrollIndex={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carouselContainer: {
    alignItems: 'center',
    width: WINDOW_WIDTH,
  },
  contentContainer: {
    paddingHorizontal: SNAP_OFFSET,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressable: {
    height: CARD_HEIGHT,
    width: ITEM_WIDTH,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default CardCarousel;
