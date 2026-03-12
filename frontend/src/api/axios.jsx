import axios from 'axios';

const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? 'http://localhost:5000/api' : '/api';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;