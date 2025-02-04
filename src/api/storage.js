import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
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

// Parent Balance Management
export const getParentBalance = async (username) => {
  try {
    const balanceKey = `parent_balance_${username}`;
    const balance = await AsyncStorage.getItem(balanceKey);
    return balance ? parseFloat(balance) : 0;
  } catch (error) {
    console.error('Error getting parent balance:', error);
    return 0;
  }
};

export const setParentBalance = async (username, balance) => {
  try {
    const balanceKey = `parent_balance_${username}`;
    await AsyncStorage.setItem(balanceKey, balance.toString());
  } catch (error) {
    console.error('Error setting parent balance:', error);
  }
};

export const updateParentBalance = async (username, amount) => {
  try {
    const currentBalance = await getParentBalance(username);
    const newBalance = currentBalance + amount;
    if (newBalance < 0) return false;
    await setParentBalance(username, newBalance);
    return true;
  } catch (error) {
    console.error('Error updating parent balance:', error);
    return false;
  }
};

export { setToken, getToken, deleteToken, isTokenExpired, getRole };
