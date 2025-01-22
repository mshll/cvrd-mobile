import { View } from 'tamagui';
import { Dimensions } from 'react-native';
import { Colors } from '@/config/colors';
import { useRoute } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import CardComponent from '@/components/CardComponent';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const CARD_ASPECT_RATIO = 1630 / 1024;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.8); // Bigger card in details
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);

const CardDetailsScreen = () => {
  const route = useRoute();
  const { card } = route.params;

  return (
    <View f={1} bg={Colors.dark.background} ai="center" pt={'$5'}>
      <Animated.View
        sharedTransitionTag={`card-${card.id}`}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          overflow: 'hidden',
        }}
      >
        <CardComponent type={card.type} label={card.label} emoji={card.emoji} lastFourDigits={card.lastFourDigits} color={card.backgroundColor} />
      </Animated.View>
    </View>
  );
};

export default CardDetailsScreen;
