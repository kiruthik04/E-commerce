import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8086/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically attach a valid JWT if present
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
