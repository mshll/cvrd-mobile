import * as React from 'react';
import { StyleSheet, Pressable, Animated } from 'react-native';
import { View, XStack, YStack, Text, Button } from 'tamagui';
import { Colors } from '../config/colors';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '../navigation/paths';
import CardComponent from './CardComponent';
import { WINDOW_WIDTH, CARD_WIDTH as CARD_WIDTH_DEFAULT, CARD_HEIGHT as CARD_HEIGHT_DEFAULT } from '@/utils/cardUtils';
import { PlusIcon } from 'react-native-heroicons/solid';

const CARD_SCALE = 0.9;
const CARD_HEIGHT = CARD_HEIGHT_DEFAULT * CARD_SCALE;
const CARD_WIDTH = CARD_WIDTH_DEFAULT * CARD_SCALE;
const SPACING = 2;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const SIDE_SPACING = (WINDOW_WIDTH - CARD_WIDTH) / 2;

const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

function CardCarousel({ title, data = [], icon: Icon }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef(null);

  // Debug logging
  console.log('🎠 CardCarousel:', {
    title,
    dataLength: data?.length || 0,
    data: data,
  });

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

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: index * ITEM_WIDTH,
        animated: true,
      });
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
        <Pressable
          onPress={() => handleCardPress(item, index)}
          style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        >
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [{ scale }],
                marginHorizontal: SPACING,
              },
            ]}
          >
            <CardComponent displayData={item} scale={CARD_SCALE} />
          </Animated.View>
        </Pressable>
      );
    },
    [handleCardPress, scrollX]
  );

  React.useEffect(() => {
    // Center the first card after mounting
    if (flatListRef.current && data.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToOffset({
          offset: 0,
          animated: false,
        });
      }, 100);
    }
  }, [data]);

  const handleAddCard = () => {
    navigation.navigate(Paths.ADD_CARD_SCREEN);
  };

  return (
    <View w="100%" mb="$7" gap="$4">
      <XStack ai="center" mb="$2" gap="$2" px="$4">
        {Icon && <Icon size={20} color={colors.text} />}
        <Text color={colors.text} fontSize="$4" fontFamily="$archivoBlack">
          {title}
        </Text>
      </XStack>
      <View w="100%" h={CARD_HEIGHT} ai="center">
        {data.length === 0 ? (
          <Button
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            borderRadius={15}
            borderWidth={1}
            borderStyle="dashed"
            borderColor={colors.border}
            backgroundColor={'transparent'}
            pressStyle={{ backgroundColor: colors.backgroundTertiary }}
            onPress={handleAddCard}
            alignItems="center"
            justifyContent="center"
            mx={SPACING}
          >
            <PlusIcon size={24} color={colors.textTertiary} />
          </Button>
        ) : (
          <AnimatedFlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate={0.8}
            bounces={false}
            snapToAlignment="start"
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: true,
            })}
            onMomentumScrollEnd={onScrollEnd}
            contentContainerStyle={styles.contentContainer}
            getItemLayout={(data, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
            initialScrollIndex={0}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
