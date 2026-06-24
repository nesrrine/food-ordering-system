// routes/admin.js
const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createFood,
  updateFood,
  deleteFood,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, adminAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Foods (read is public via /foods, admin manages here)
router.post('/foods', createFood);
router.put('/foods/:id', updateFood);
router.delete('/foods/:id', deleteFood);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;