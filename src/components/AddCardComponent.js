import { Text, View, Image } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Dimensions, StyleSheet } from 'react-native';

const window = Dimensions.get('window');
const WINDOW_WIDTH = window.width;
const CARD_ASPECT_RATIO = 1.586;
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
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance;
};

const AddCardComponent = ({
  type = 'Location',
  label = 'Location',
  emoji = '📍',
  color = 'pink',
}) => {
  let cardColor;
  let cardTheme;

  const getCardImg = (theme) => {
    if (type === 'Location' && theme === 'light')
      return require('../../assets/cards/location-front-light.png');
    if (type === 'Location' && theme === 'dark')
      return require('../../assets/cards/location-front-dark.png');
    if (type === 'Burner' && theme === 'light')
      return require('../../assets/cards/burner-front-light.png');
    if (type === 'Burner' && theme === 'dark')
      return require('../../assets/cards/burner-front-dark.png');
    if (type === 'Merchant' && theme === 'light')
      return require('../../assets/cards/merchant-front-light.png');
    if (type === 'Merchant' && theme === 'dark')
      return require('../../assets/cards/merchant-front-dark.png');
    if (type === 'Category' && theme === 'light')
      return require('../../assets/cards/category-front-light.png');
    if (type === 'Category' && theme === 'dark')
      return require('../../assets/cards/category-front-dark.png');
  };

  const getLogoImg = (theme) => {
    return theme === 'light'
      ? require('../../assets/logo-white.png')
      : require('../../assets/logo-black.png');
  };

  switch (color) {
    case 'pink':
      cardColor = '#E14C81';
      break;
    case 'green':
      cardColor = '#44D47D';
      break;
    case 'blue':
      cardColor = '#3981A6';
      break;
    case 'yellow':
      cardColor = '#EBE14B';
      break;
    default:
      cardColor = color;
  }

  // Determine theme based on color luminance
  const luminance = getLuminance(cardColor);
  cardTheme = luminance > 0.5 ? 'dark' : 'light';

  const cardImg = getCardImg(cardTheme);
  const logoImg = getLogoImg(cardTheme);
  const textColor = cardTheme === 'light' ? 'white' : 'black';

  return (
    <View
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      borderRadius={20}
      overflow="hidden"
      bg={cardColor}
    >
      <Image source={cardImg} style={styles.cardImage} resizeMode="cover" />

      {/* Top Left Badge */}
      <BlurView intensity={15} tint={cardTheme} style={[styles.badge, styles.topLeft]}>
        <Text fontSize={16} style={styles.emoji}>
          {emoji}
        </Text>
        <Text fontSize={13} color={textColor} marginLeft={6} fontWeight="700" fontFamily="$heading">
          {label}
        </Text>
      </BlurView>

      {/* Middle Right Logo */}
      <View style={styles.logoContainer}>
        <Image source={logoImg} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  badge: {
    position: 'absolute',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  topLeft: {
    top: 16,
    left: 16,
  },
  emoji: {
    marginTop: -2,
  },
  logoContainer: {
    position: 'absolute',
    right: 30,
    top: '50%',
    transform: [{ translateY: -15 }],
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
});

export default AddCardComponent;
