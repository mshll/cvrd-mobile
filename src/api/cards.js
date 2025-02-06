import { Colors } from '@/config/colors';
import instance from './index';

// Default configurations for each card type
export const CARD_DEFAULTS = {
  BURNER: {
    icon: '🔥',
    color: Colors.cards.red,
  },
  CATEGORY_LOCKED: {
    icon: '📅',
    color: Colors.cards.pink,
  },
  MERCHANT_LOCKED: {
    icon: '🛍️',
    color: Colors.cards.green,
  },
  LOCATION_LOCKED: {
    icon: '📍',
    color: Colors.cards.navy,
  },
};

/**
 * Helper function to process limits
 * @param {Object} limits - The spending limits object
 * @returns {Object} Processed limits object with only non-zero values
 */
function processLimits(limits) {
  if (!limits) return {};

  // Log the incoming limits
  console.log('📊 Processing limits:', limits);

  // Initialize all limits to 0
  const processedLimits = {
    per_transaction: 0,
    per_day: 0,
    per_week: 0,
    per_month: 0,
    per_year: 0,
    total: 0,
  };

  // Update with any non-zero values from the input
  Object.entries(limits).forEach(([key, value]) => {
    if (value && value > 0) {
      processedLimits[key] = parseFloat(value);
    }
  });

  // Log the processed limits
  console.log('✅ Processed limits:', processedLimits);

  return processedLimits;
}

/**
 * Creates a new burner card
 * @param {Object} cardData - The card data
 * @param {string} cardData.name - The name of the card
 * @param {Object} cardData.limits - The spending limits for the card
 * @returns {Promise<Object>} The created card data
 */
export async function createBurnerCard(cardData) {
  const requestBody = {
    cardName: cardData.name,
    cardIcon: CARD_DEFAULTS.BURNER.icon,
    cardColor: CARD_DEFAULTS.BURNER.color,
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  console.log('📤 Creating burner card with request body:', requestBody);

  const response = await instance.post('/card/create/burner', requestBody);
  return response.data;
}

/**
 * Creates a new category-locked card
 * @param {Object} cardData - The card data
 * @param {string} cardData.name - The name of the card
 * @param {Object} cardData.category - The category object with name property
 * @param {Object} cardData.limits - The spending limits for the card
 * @returns {Promise<Object>} The created card data
 */
export async function createCategoryCard(cardData) {
  const requestBody = {
    cardName: cardData.name,
    cardIcon: CARD_DEFAULTS.CATEGORY_LOCKED.icon,
    cardColor: CARD_DEFAULTS.CATEGORY_LOCKED.color,
    categoryName: cardData.category.name.toUpperCase(),
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  console.log('📤 Creating category card with request body:', requestBody);

  const response = await instance.post('/card/create/category-locked', requestBody);
  return response.data;
}

/**
 * Creates a new merchant-locked card
 * @param {Object} cardData - The card data
 * @param {string} cardData.name - The name of the card
 * @param {Object} cardData.merchant - The merchant data
 * @param {Object} cardData.limits - The spending limits for the card
 * @returns {Promise<Object>} The created card data
 */
export async function createMerchantCard(cardData) {
  const requestBody = {
    cardName: cardData.name,
    cardIcon: CARD_DEFAULTS.MERCHANT_LOCKED.icon,
    cardColor: CARD_DEFAULTS.MERCHANT_LOCKED.color,
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  console.log('📤 Creating merchant card with request body:', requestBody);

  const response = await instance.post('/card/create/merchant-locked', requestBody);
  return response.data;
}

/**
 * Creates a new location-locked card
 * @param {Object} cardData - The card data
 * @param {string} cardData.name - The name of the card
 * @param {Object} cardData.location - The location data with latitude and longitude
 * @param {number} cardData.radius - The radius in kilometers
 * @param {Object} cardData.limits - The spending limits for the card
 * @returns {Promise<Object>} The created card data
 */
export async function createLocationCard(cardData) {
  const requestBody = {
    cardName: cardData.name,
    cardIcon: CARD_DEFAULTS.LOCATION_LOCKED.icon,
    cardColor: CARD_DEFAULTS.LOCATION_LOCKED.color,
    latitude: cardData.location.latitude,
    longitude: cardData.location.longitude,
    radius: cardData.radius,
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  console.log('📤 Creating location card with request body:', requestBody);

  const response = await instance.post('/card/create/location-locked', requestBody);
  return response.data;
}

/**
 * Fetches all cards for the current user
 * @returns {Promise<Array>} Array of card objects
 */
export async function fetchUserCards() {
  console.log('🔄 Fetching user cards...');
  try {
    const response = await instance.get('/user/me/cards');
    console.log('✅ Cards fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching cards:', error.response?.data || error.message);
    throw error;
  }
}
