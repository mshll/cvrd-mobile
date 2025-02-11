import instance from '.';

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

export const updateUser = async (userData) => {
  const response = await instance.put('/user/me', userData);
  return response.data;
};

export async function getCardIssuanceLimit() {
  const response = await instance.get('/user/me/card-issuance-limit');
  return response.data;
}
