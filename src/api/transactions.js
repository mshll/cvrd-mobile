import instance from './index';

/**
 * Fetch all transactions for the current user
 * @returns {Promise<Array>} Array of transaction objects
 */
export async function fetchUserTransactions() {
  const response = await instance.get('/transaction/me');
  return response.data;
}

/**
 * Fetch transactions for a specific card
 * @param {string} cardId - The ID of the card
 * @returns {Promise<Array>} Array of transaction objects
 */
export async function fetchCardTransactions(cardId) {
  const response = await instance.get(`/transaction/card/${cardId}`);
  return response.data;
}
