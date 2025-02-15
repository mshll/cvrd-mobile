import instance from './index';

// Plan type constants
export const PLAN_TYPES = {
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
};

/**
 * Get all available subscription plans
 * @returns {Promise<Array>} List of available plans with their features and limits
 */
export const getPlans = async () => {
  const response = await instance.get('/plans');
  return response.data;
};

/**
 * Upgrade to a higher-tier plan
 * @param {string} planName - Name of the plan to upgrade to
 * @returns {Promise<Object>} Updated user plan information
 */
export const upgradePlan = async (planName) => {
  const response = await instance.post('/plans/upgrade', { planName });
  return response.data;
};

/**
 * Downgrade to a lower-tier plan
 * @param {string} planName - Name of the plan to downgrade to
 * @returns {Promise<Object>} Updated user plan information
 */
export const downgradePlan = async (planName) => {
  const response = await instance.post('/plans/downgrade', { planName });
  return response.data;
};

/**
 * Toggle auto-renewal for premium plans
 * @returns {Promise<Object>} Updated auto-renewal status
 */
export const toggleAutoRenewal = async () => {
  const response = await instance.post('/plans/auto-renewal/toggle');
  return response.data;
};
