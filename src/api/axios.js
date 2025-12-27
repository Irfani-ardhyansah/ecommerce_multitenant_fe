import axios from 'axios';

const getBaseUrl = () => {
  const host = window.location.hostname; // Contoh: localhost atau tenant1.localhost
  const centralApiHost = import.meta.env.VITE_CENTRAL_DOMAIN; // Contoh: localhost:8000

  if (host === 'localhost' || host === '127.0.0.1') {
    return `http://${centralApiHost}/api`;
  } 

  return `http://${host}:8000/api`;
};

const instance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor untuk Token Otomatis
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;