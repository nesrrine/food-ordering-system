import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ================= TOKEN =================
const withToken = (config = {}) => {
  const token = localStorage.getItem('token');

  if (!token) return config;

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
};

// ================= AUTH =================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),

  // FIX: backend عندك /profile مش /me
  getCurrentUser: () => api.get('/auth/profile', withToken()),
};

// ================= FOODS =================
export const foodsAPI = {
  getAll: () => api.get('/foods'),
  getById: (id) => api.get(`/foods/${id}`),
};

// ================= ORDERS =================
export const ordersAPI = {
  getMyOrders: () => api.get('/orders', withToken()),
  createOrder: (data) => api.post('/orders', data, withToken()),

  // FIX إضافي باش ما يطلعلكش errors مستقبلًا
  getById: (id) => api.get(`/orders/${id}`, withToken()),
};

// ================= PAYMENTS =================
export const paymentsAPI = {
  createPayment: (data) => api.post('/payments/initialize', data, withToken()),
  verifyPayment: (id) => api.get(`/payments/verify/${id}`, withToken()),
};

// ================= ADMIN =================
export const adminAPI = {
  getDashboardStats: () =>
    api.get('/admin/dashboard', withToken()),

  getUsers: () =>
    api.get('/admin/users', withToken()),

  getAllOrders: () =>
    api.get('/admin/orders', withToken()),

  updateOrderStatus: (id, data) =>
    api.put(`/admin/orders/${id}/status`, data, withToken()),

  createFood: (data) =>
    api.post('/admin/foods', data, withToken()),

  updateFood: (id, data) =>
    api.put(`/admin/foods/${id}`, data, withToken()),

  deleteFood: (id) =>
    api.delete(`/admin/foods/${id}`, withToken()),
};

export default api;