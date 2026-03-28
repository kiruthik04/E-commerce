import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8083/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock interceptor to automatically attach a valid JWT.
// In a full application, this would fetch from localStorage or AuthContext
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

export default api;
