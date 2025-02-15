import instance from './index';

import { Colors } from '@/context/ColorSchemeContext';

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
  //console.log('📊 Processing limits:', limits);

  // Initialize all limits to null
  const processedLimits = {
    per_transaction: null,
    per_day: null,
    per_week: null,
    per_month: null,
    per_year: null,
    total: null,
  };

  // Update with any non-zero values from the input
  Object.entries(limits).forEach(([key, value]) => {
    if (value && value > 0) {
      processedLimits[key] = parseFloat(value);
    }
  });

  // Log the processed limits
  //console.log('✅ Processed limits:', processedLimits);

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
    cardIcon: cardData.cardIcon || CARD_DEFAULTS.BURNER.icon,
    cardColor: cardData.cardColor || CARD_DEFAULTS.BURNER.color,
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
    cardIcon: cardData.cardIcon || CARD_DEFAULTS.CATEGORY_LOCKED.icon,
    cardColor: cardData.cardColor || CARD_DEFAULTS.CATEGORY_LOCKED.color,
    categoryName: cardData.category.name.toUpperCase(),
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  //console.log('📤 Creating category card with request body:', requestBody);

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
    cardIcon: cardData.cardIcon || CARD_DEFAULTS.MERCHANT_LOCKED.icon,
    cardColor: cardData.cardColor || CARD_DEFAULTS.MERCHANT_LOCKED.color,
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  //console.log('📤 Creating merchant card with request body:', requestBody);

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
    cardIcon: cardData.cardIcon || CARD_DEFAULTS.LOCATION_LOCKED.icon,
    cardColor: cardData.cardColor || CARD_DEFAULTS.LOCATION_LOCKED.color,
    latitude: cardData.location.latitude,
    longitude: cardData.location.longitude,
    radius: cardData.radius,
    ...processLimits(cardData.limits),
  };

  // Log the full request body
  //console.log('📤 Creating location card with request body:', requestBody);

  const response = await instance.post('/card/create/location-locked', requestBody);
  return response.data;
}

/**
 * Fetches all cards for the current user
 * @returns {Promise<Array>} Array of card objects
 */
export async function fetchUserCards() {
  //console.log('🔄 Fetching user cards...');
  try {
    const response = await instance.get('/user/me/cards');
    //console.log('✅ Cards fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching cards:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Updates a card's spending limit
 * @param {string} cardId - The ID of the card to update
 * @param {string} limitType - The type of limit to update (PER_TRANSACTION, PER_DAY, etc.)
 * @param {number|null} amount - The amount to set for the limit, or null to remove the limit
 * @returns {Promise<Object>} The updated card data
 */
export async function updateCardLimit(cardId, limitType, amount) {
  // Log the update request
  //console.log('📤 Updating card limit:', { cardId, limitType, amount });

  const requestBody = {
    limitType: limitType.toUpperCase(),
    ...(amount === null ? { removeLimit: true } : { amount: parseFloat(amount) }),
  };

  const response = await instance.put(`/card/update/${cardId}/limit`, requestBody);
  return response.data;
}

export async function togglePause(cardId) {
  const response = await instance.put(`/card/${cardId}/toggle-pause`);
  return response.data;
}

export async function togglePin(cardId) {
  const response = await instance.put(`/card/${cardId}/toggle-pin`);
  return response.data;
}

export async function closeCard(cardId) {
  const response = await instance.put(`/card/${cardId}/close`);
  return response.data;
}

export async function updateCard(cardId, updates) {
  // Log the update request
  //console.log('📝 Updating card:', { cardId, updates });

  const response = await instance.put(`/card/update/${cardId}`, updates);
  return response.data;
}

export async function getUserCards() {
  try {
    const response = await instance.get('/user/me/cards');
    return response.data;
  } catch (error) {
    console.error('Error fetching user cards:', error);
    throw error;
  }
}

/**
 * Updates a card's location and radius
 * @param {string} cardId - The ID of the card to update
 * @param {Object} locationData - The new location data
 * @param {number} locationData.latitude - The latitude coordinate
 * @param {number} locationData.longitude - The longitude coordinate
 * @param {number} locationData.radius - The radius in kilometers
 * @returns {Promise<Object>} The updated card data
 */
export async function updateCardLocation(cardId, locationData) {
  const response = await instance.put(`/card/update-location/${cardId}`, locationData);
  return response.data;
}
