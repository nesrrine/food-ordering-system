// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Add token to requests
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle response errors
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getCurrentUser: () => API.get('/auth/profile')
};

// Foods API
export const foodAPI = {
  getAllFoods: () => API.get('/foods'),
  getFoodById: (id) => API.get(`/foods/${id}`)
};

// Orders API
export const orderAPI = {
  createOrder: (data) => API.post('/orders', data),
  getUserOrders: () => API.get('/orders'),
  getOrderById: (id) => API.get(`/orders/${id}`)
};

// Payments API
export const paymentAPI = {
  initializePayment: (data) => API.post('/payments/initialize', data)
};

export default API;