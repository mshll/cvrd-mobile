import { Text, View, Image, XStack, YStack } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '@/config/colors';
import { useCards } from '@/hooks/useCards';
import { PauseCircle, XCircle } from '@tamagui/lucide-icons';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const CARD_ASPECT_RATIO = 1630 / 1024;
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);

// Calculate relative luminance
const getLuminance = (hexColor) => {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert hex to rgb
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Calculate luminance using the relative luminance formula
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
};

const CardComponent = ({ cardId, displayData }) => {
  const { getCardById } = useCards();
  const card = cardId ? getCardById(cardId) : null;

  // If displayData is provided, use it directly, otherwise generate from card
  const {
    type = 'Location',
    label = 'Location',
    emoji = '📍',
    lastFourDigits = '1234',
    backgroundColor = 'pink',
    isPaused = card?.is_paused || false,
    isClosed = card?.is_closed || false,
  } = displayData ||
  (card
    ? {
        type: card.card_type,
        label: card.card_name,
        emoji: card.card_icon,
        lastFourDigits: card.card_number.slice(-4),
        backgroundColor: card.card_color,
        isPaused: card.is_paused,
        isClosed: card.is_closed,
      }
    : {});

  let cardColor = Colors.cards[backgroundColor] || backgroundColor;
  let cardTheme;

  const getCardImg = (theme) => {
    if (type === 'Location' && theme === 'light') return require('../../assets/cards/location-front-light.png');
    if (type === 'Location' && theme === 'dark') return require('../../assets/cards/location-front-dark.png');
    if (type === 'Burner' && theme === 'light') return require('../../assets/cards/burner-front-light.png');
    if (type === 'Burner' && theme === 'dark') return require('../../assets/cards/burner-front-dark.png');
    if (type === 'Merchant' && theme === 'light') return require('../../assets/cards/merchant-front-light.png');
    if (type === 'Merchant' && theme === 'dark') return require('../../assets/cards/merchant-front-dark.png');
    if (type === 'Category' && theme === 'light') return require('../../assets/cards/category-front-light.png');
    if (type === 'Category' && theme === 'dark') return require('../../assets/cards/category-front-dark.png');
  };

  // Determine theme based on color luminance
  const luminance = getLuminance(cardColor);
  cardTheme = luminance > 0.5 ? 'dark' : 'light';
  const blurTint = cardTheme === 'light' ? 'systemThickMaterialDark' : 'systemThickMaterialLight';

  const cardImg = getCardImg(cardTheme);
  const textColor = cardTheme === 'light' ? 'white' : 'black';

  return (
    <View width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={20} overflow="hidden" bg={cardColor}>
      {/* Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />
        {(isPaused || isClosed) && (
          <View style={[StyleSheet.absoluteFill, styles.statusOverlay]}>
            <BlurView intensity={50} tint={blurTint} style={styles.statusBadge}>
              {isPaused && <PauseCircle size={20} color={textColor} />}
              {isClosed && <XCircle size={20} color={textColor} />}
              <Text fontSize={14} color={textColor} marginLeft={8} fontWeight="600">
                {isClosed ? 'Closed' : isPaused ? 'Paused' : ''}
              </Text>
            </BlurView>
          </View>
        )}
      </View>

      {/* Content Layer */}
      <YStack style={styles.contentContainer}>
        {/* Top Row */}
        <XStack style={styles.topRow}>
          {/* <XStack flex={1} justifyContent="flex-start" flexWrap="wrap"> */}
          <BlurView intensity={20} tint={blurTint} style={styles.badge}>
            <Text fontSize={14}>{emoji}</Text>
            <Text fontSize={12} color={textColor} marginLeft={4} fontWeight="600">
              {label}
            </Text>
          </BlurView>
          {/* </XStack> */}

          {/* <XStack flex={1} justifyContent="flex-end" flexWrap="wrap"> */}
          <BlurView intensity={20} tint={blurTint} style={styles.badge}>
            <Text fontSize={12} color={textColor} fontWeight="600">
              {type}
            </Text>
          </BlurView>
        </XStack>
        {/* </XStack> */}

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <Text fontSize={16} color={textColor} fontWeight="600" pb="$1" pl="$1">
            •••• &nbsp;{lastFourDigits}
          </Text>
        </View>
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap-reverse',
  },
  bottomRow: {
    flexDirection: 'row',
  },
  badge: {
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  statusOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    overflow: 'hidden',
  },
});

export default CardComponent;
