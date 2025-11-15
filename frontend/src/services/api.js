import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const analyzeText = async (text) => {
  const response = await api.post('/analyze/text', { text });
  return response.data;
};

export const analyzeUrl = async (url) => {
  const response = await api.post('/analyze/url', { url });
  return response.data;
};

export const getPlatforms = async () => {
  const response = await api.get('/platforms');
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getTimeline = async (limit = 20) => {
  const response = await api.get(`/timeline?limit=${limit}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.delete('/timeline');
  return response.data;
};

export default api;
