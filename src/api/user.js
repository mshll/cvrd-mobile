import instance from './index';

export const getAllUsers = async () => {
  const response = await instance.get('/user/view-all');
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await instance.get(`/user/view/${userId}`);
  return response.data;
};

export const getUser = async () => {
  const response = await instance.get('/user/me');
  return response.data;
};

export const updateUser = async (updates) => {
  const response = await instance.put('/user/me', updates);
  return response.data;
};

export const getCardIssuanceLimit = async () => {
  const response = await instance.get('/user/me/card-issuance-limit');
  return response.data;
};

export const disconnectBank = async () => {
  const response = await instance.post('/user/me/disconnect-bank');
  return response.data;
};

export const connectBank = async (bankAccountUsername, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await instance.post('/user/me/connect-bank', { bankAccountUsername }, config);
  return response.data;
};
