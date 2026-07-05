import axios from 'axios';

const API = axios.create({
  baseURL: 'https://pranubytes-production.up.railway.app/api',
});

// Automatically attach the JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;