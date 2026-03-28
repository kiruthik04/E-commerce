import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8087/api/recommendations',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    // For the sake of the standalone demo, we can simulate an authenticated session
    // In the real monorepo, this pulls from the shared local storage
    const token = localStorage.getItem('token') || 'demo_token'; // fallbacks if needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
