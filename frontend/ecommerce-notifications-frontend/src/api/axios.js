import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8088/api/notifications',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    // For the sake of the standalone demo, we can simulate an authenticated session payload.
    // In a real monorepo environment, you'd integrate the shared login Auth state token locally.
    const token = localStorage.getItem('token') || 'demo_token'; // fallback logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
