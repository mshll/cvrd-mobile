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

export const updateProfilePicture = async (imageUri) => {
  const formData = new FormData();
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';

  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  });

  const response = await instance.post('/user/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProfilePicture = async () => {
  const response = await instance.delete('/user/me/profile-picture');
  return response.data;
};

export const getProfilePictureUrl = (profilePicFilename) => {
  if (!profilePicFilename) return null;
  return `${instance.defaults.baseURL}/user/uploads/${profilePicFilename}`;
};
