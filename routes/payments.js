// routes/payments.js
const express = require('express');
const {
  initializePayment,
  payhereCallback,
  verifyPayment,
  getMyPayments,
  getAllPayments
} = require('../controllers/paymentController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public webhook — PayHere posts here (no auth header)
router.post('/callback', payhereCallback);

// Customer routes
router.post('/initialize', auth, initializePayment);
router.get('/my', auth, getMyPayments);
router.get('/verify/:paymentId', auth, verifyPayment);

// Admin route
router.get('/', auth, adminAuth, getAllPayments);

module.exports = router;