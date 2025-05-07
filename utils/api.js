import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-training-jo66.onrender.com/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;