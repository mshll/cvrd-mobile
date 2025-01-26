import * as React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../config/colors';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '../navigation/paths';
import { Text } from 'tamagui';
import CardComponent from './CardComponent';
import { WINDOW_WIDTH, CARD_WIDTH, CARD_HEIGHT } from '@/utils/cardUtils';

const SPACING = 2;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const SIDE_SPACING = (WINDOW_WIDTH - CARD_WIDTH) / 2;

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
        cardId: item.id,
      });
    },
    [navigation]
  );

  const onScrollEnd = React.useCallback((event) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / ITEM_WIDTH);

    if (flashListRef.current) {
      if (index === 0 && position < ITEM_WIDTH / 2) {
        flashListRef.current.scrollToOffset({
          offset: 0,
          animated: true,
        });
      } else {
        flashListRef.current.scrollToIndex({
          index: Math.max(0, index),
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, []);

  const renderItem = React.useCallback(
    ({ item, index }) => {
      const inputRange = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];

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
            <CardComponent displayData={item} />
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
        <Text fontSize="$4" fontWeight="600" fontFamily="$archivoBlack" color={colors.text} marginLeft={Icon ? 8 : 0}>
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
          decelerationRate={'fast'}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={styles.contentContainer}
          estimatedItemSize={ITEM_WIDTH}
          estimatedListSize={{ width: WINDOW_WIDTH, height: CARD_HEIGHT }}
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
    marginBottom: 58,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  carouselContainer: {
    alignItems: 'center',
    width: WINDOW_WIDTH,
  },
  contentContainer: {
    paddingHorizontal: SIDE_SPACING - SPACING,
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
