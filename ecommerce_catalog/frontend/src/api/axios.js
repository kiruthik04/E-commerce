import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8082/api',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    // We'll simulate a logged-in admin token for this mock. 
    // In a real app, you would fetch it from context/localStorage.
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
