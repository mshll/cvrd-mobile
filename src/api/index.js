import axios from 'axios';
import { getToken } from './storage';

let IP = '';
// IP = '192.168.2.37';

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

export default instance;
