import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8094', headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use(cfg => {
  // In demo mode, auto-inject a mock admin JWT so we can test without an auth service running.
  // Replace with localStorage.getItem('token') in production.
  const t = localStorage.getItem('adminToken') || 'DEMO_BYPASS';
  cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export default api;
