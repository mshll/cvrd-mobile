import instance from '.';
import { setToken } from './storage';

export const login = async (user) => {
  console.log('🔑 Making login API call with:', user);
  const response = await instance.post('/auth/login-user', user);
  if (response.data.token) {
    console.log('🎟️ Storing auth token');
    await setToken(response.data.token);
  }
  console.log('✅ Login successful');
  return response.data;
};

export const register = async (user) => {
  console.log('📝 Making registration API call with:', user);
  const response = await instance.post('/auth/signup-user', user);
  if (response.data.token) {
    console.log('🎟️ Storing auth token');
    await setToken(response.data.token);
  }
  console.log('✅ Registration successful');
  return response.data;
};

export const logout = async () => {
  console.log('🔑 Logging out');
  await removeToken();
  console.log('✅ Logout successful');
};
