import axios from 'axios';  // ✅ added axios

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_BASE_PATH = '/api';

export const getApiUrl = (endpoint: string) => {
  return `${API_URL}${API_BASE_PATH}${endpoint}`;
};

// ✅ NEW: create axios instance called api
export const api = axios.create({
  baseURL: `${API_URL}${API_BASE_PATH}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ NEW: optional request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ NEW: default export changed to api instead of just an object
export default api;
