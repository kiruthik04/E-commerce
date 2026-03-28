import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      config.headers = {
        'Authorization': `Bearer ${user.accessToken}`,
        'Accept': 'application/json',
      }
    }
    return config;
  },
  error => {
    Promise.reject(error)
  }
);

// Response interceptor for API calls
api.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const { data } = await axios.post('http://localhost:8081/api/auth/refresh', {
          refreshToken: user.refreshToken
        });
        
        // Update user state in local storage
        localStorage.setItem('user', JSON.stringify({
          ...user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }));
        
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
        return api(originalRequest);
      }
    } catch (refreshError) {
      // Refresh token failed, clear user
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default api;
