import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setToken = async (token) => {
  await setItemAsync('token', token);
  const { role } = jwtDecode(token);
  await setItemAsync('role', role);
};

const getToken = async () => {
  const token = await getItemAsync('token');
  if (await isTokenExpired(token)) return null;
  return token;
};

const deleteToken = async () => {
  await deleteItemAsync('token');
  await deleteItemAsync('role');
};

const isTokenExpired = async (token) => {
  try {
    if (!token) return true;

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      await deleteToken();
      return true;
    }

    return false;
  } catch (error) {
    await deleteToken();
    return true;
  }
};

const getRole = async () => {
  return await getItemAsync('role');
};

export { setToken, getToken, deleteToken, isTokenExpired, getRole };
