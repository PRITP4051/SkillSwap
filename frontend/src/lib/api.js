import axios from 'axios';

let unauthorizedHandler = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401/403 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('skillswap_token');
      if (unauthorizedHandler) {
        unauthorizedHandler();
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;
