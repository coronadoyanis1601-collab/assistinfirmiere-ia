import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ai_token');
      localStorage.removeItem('ai_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
