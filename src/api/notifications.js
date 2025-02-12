import instance from './index';

/**
 * Save the Expo push notification token to the backend
 * @param {string} token - The Expo push notification token
 * @returns {Promise} Response from the server
 */
export const saveNotificationToken = async (token) => {
  const response = await instance.post('/notifications/token', { token });
  return response.data;
};

/**
 * Get user's notifications
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} Paginated notifications
 */
export const getNotifications = async (page = 0, size = 20) => {
  const response = await instance.get(`/notifications?page=${page}&size=${size}`);
  return response.data;
};

/**
 * Mark a notification as read
 * @param {number} notificationId - ID of the notification to mark as read
 * @returns {Promise} Response from the server
 */
export const markNotificationAsRead = async (notificationId) => {
  const response = await instance.put(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Get count of unread notifications
 * @returns {Promise<number>} Number of unread notifications
 */
export const getUnreadCount = async () => {
  const response = await instance.get('/notifications/unread-count');
  return response.data;
};

/**
 * Toggle notifications on/off
 * @returns {Promise<boolean>} New notification state
 */
export const toggleNotifications = async () => {
  const response = await instance.put('/notifications/toggle-notifications');
  return response.data;
};
