import axios from 'axios';
import { setError } from '../store/slices/errorSlice';

// We import store dynamically to avoid circular dependencies
let store;
export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network Error';
    
    if (error.response?.status === 401 && store) {
      // Dispatch logout if unauthorized
      store.dispatch({ type: 'auth/logout' });
    }
    
    if (store) {
      store.dispatch(setError(message));
    }
    
    return Promise.reject(error);
  }
);

export default api;
