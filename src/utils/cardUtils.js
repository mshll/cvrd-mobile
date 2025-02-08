import { Dimensions } from 'react-native';

// Card dimensions
const window = Dimensions.get('window');
export const WINDOW_WIDTH = window.width;
export const CARD_ASPECT_RATIO = 1630 / 1024;
export const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.6);
export const CARD_HEIGHT = Math.round(CARD_WIDTH * CARD_ASPECT_RATIO);
export const CARD_WIDTH_LARGE = Math.round(WINDOW_WIDTH * 0.8);
export const CARD_HEIGHT_LARGE = Math.round(CARD_WIDTH_LARGE * CARD_ASPECT_RATIO);

// Card theme utilities
export const getLuminance = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getCardTheme = (cardColor) => {
  const luminance = getLuminance(cardColor);
  return luminance > 0.5 ? 'dark' : 'light';
};

// Card assets
export function getCardAssets(cardType = 'BURNER', theme = 'light') {
  // Normalize card type to uppercase and ensure it exists
  const normalizedType = (cardType || 'BURNER').toUpperCase();
  const safeTheme = theme || 'light';

  const cardImages = {
    LOCATION: {
      light: require('../../assets/cards/location-front-light.png'),
      dark: require('../../assets/cards/location-front-dark.png'),
    },
    BURNER: {
      light: require('../../assets/cards/burner-front-light.png'),
      dark: require('../../assets/cards/burner-front-dark.png'),
    },
    MERCHANT: {
      light: require('../../assets/cards/merchant-front-light.png'),
      dark: require('../../assets/cards/merchant-front-dark.png'),
    },
    CATEGORY: {
      light: require('../../assets/cards/category-front-light.png'),
      dark: require('../../assets/cards/category-front-dark.png'),
    },
  };

  const logoImages = {
    light: require('../../assets/logo-white.png'),
    dark: require('../../assets/logo-black.png'),
  };

  const visaImages = {
    light: require('../../assets/visa-white.png'),
    dark: require('../../assets/visa-black.png'),
  };

  // Debug log for asset lookup
  console.log('🔍 Asset lookup:', {
    requestedType: normalizedType,
    requestedTheme: safeTheme,
    availableTypes: Object.keys(cardImages),
    foundCardImage: !!cardImages[normalizedType]?.[safeTheme],
  });

  // Default assets
  const defaultAssets = {
    cardImg: cardImages.BURNER[safeTheme],
    logoImg: logoImages[safeTheme],
    visaImg: visaImages[safeTheme],
  };

  try {
    const assets = {
      cardImg: cardImages[normalizedType]?.[safeTheme] || defaultAssets.cardImg,
      logoImg: logoImages[safeTheme] || defaultAssets.logoImg,
      visaImg: visaImages[safeTheme] || defaultAssets.visaImg,
    };

    // Debug log for returned assets
    console.log('📦 Returning assets:', {
      type: normalizedType,
      theme: safeTheme,
      hasCardImg: !!assets.cardImg,
      hasLogoImg: !!assets.logoImg,
      hasVisaImg: !!assets.visaImg,
    });

    return assets;
  } catch (error) {
    console.warn('❌ Error getting card assets:', error);
    return defaultAssets;
  }
}

// Card formatting utilities
export const formatCardNumber = (number) => {
  return number.match(/.{1,4}/g);
};

export const formatExpiryDate = (date) => {
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
};
