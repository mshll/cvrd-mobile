import instance from './index';
import { togglePause } from './cards';
import { MERCHANT_NAMES, MERCHANT_LOGOS, MERCHANT_PATTERNS } from '@/data/merchants';

/**
 * Fetch user's subscriptions
 * @returns {Promise<Array>} Array of subscription objects
 */
export async function fetchUserSubscriptions() {
  const response = await instance.get('/user/me/subscriptions');
  return response.data;
}

/**
 * Toggle subscription by pausing/unpausing its associated card
 * @param {number} cardId - The ID of the card associated with the subscription
 * @returns {Promise<Object>} Updated card object
 */
export async function toggleSubscriptionCard(cardId) {
  return togglePause(cardId);
}

// Re-export merchant data for convenience
export { MERCHANT_NAMES as SUPPORTED_MERCHANTS, MERCHANT_LOGOS, MERCHANT_PATTERNS };
