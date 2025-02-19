import axios from 'axios';
import { getToken } from './storage';

// input ip address here (comment out to use localhost)

// let IP = '';
// export const IP = '146.190.206.232';
export const URL = 'https://cvrd-be.mshl.me';

const instance = axios.create({
  // baseURL: `http://${IP || 'localhost'}:8080`,
  baseURL: URL,
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// log response
instance.interceptors.response.use(
  (response) => {
    console.log('🔄 Response:', response.data);
    return response;
  },
  (error) => {
    console.log('🚩 Error:', error.response.data);
    return Promise.reject(error);
  }
);
export default instance;
