import axios from 'axios';
import { getToken } from './storage';

let IP = '';
// input ip address here (comment out to use localhost)
IP = '172.20.10.3';

const instance = axios.create({
  baseURL: `http://${IP || 'localhost'}:8080`,
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
    console.log('🔄 Error:', error.response.data);
    return Promise.reject(error);
  }
);
export default instance;
