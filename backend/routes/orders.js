// routes/orders.js
const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(auth);

router.post('/', createOrder);           // POST /api/orders
router.get('/', getUserOrders);          // GET  /api/orders
router.get('/:id', getOrderById);        // GET  /api/orders/:id

module.exports = router;