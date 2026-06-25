// routes/orders.js
const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(auth);

router.post('/', createOrder);           // POST /api/orders
router.get('/', getMyOrders);          // GET  /api/orders
router.get('/:id', getOrderById);        // GET  /api/orders/:id

module.exports = router;