// controllers/paymentController.js
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// ─────────────────────────────────────────────
// INITIALIZE PAYMENT
// ─────────────────────────────────────────────
// Called by frontend before redirecting to PayHere
// Returns the payment params needed to build the PayHere form

exports.initializePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Make sure the order belongs to this user
    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order already paid' });
    }

    const merchantCode = process.env.PAYHERE_MERCHANT_CODE;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const paymentId = `PAY-${Date.now()}`;
    const amount = order.totalAmount.toFixed(2);
    const currency = 'USD';

    // PayHere hash: MD5(merchant_id + order_id + amount + currency + MD5(secret))
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const hash = crypto
      .createHash('md5')
      .update(`${merchantCode}${paymentId}${amount}${currency}${hashedSecret}`)
      .digest('hex')
      .toUpperCase();

    // Save a pending Payment record
    await Payment.create({
      paymentId,
      orderId: order._id,
      customerId: req.user.id,
      amount: order.totalAmount,
      currency,
      status: 'pending',
      transactionDetails: { merchant_code: merchantCode, reference_id: order.orderId }
    });

    res.status(200).json({
      success: true,
      paymentParams: {
        sandbox: true,
        merchant_id: merchantCode,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        notify_url: process.env.PAYHERE_CALLBACK_URL,
        order_id: paymentId,
        items: `Order #${order.orderId}`,
        amount,
        currency,
        hash,
        first_name: req.user.fullName?.split(' ')[0] || 'Customer',
        last_name: req.user.fullName?.split(' ').slice(1).join(' ') || '',
        email: order.customerEmail || req.user.email,
        phone: order.customerPhone || req.user.phone,
        address: order.deliveryAddress?.street || '',
        city: order.deliveryAddress?.city || '',
        country: 'Sri Lanka'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// PAYHERE CALLBACK (notify_url)
// ─────────────────────────────────────────────
// PayHere posts to this endpoint after payment

exports.payhereCallback = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,      // this is our paymentId
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      message
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Verify PayHere signature
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const expectedSig = crypto
      .createHash('md5')
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`
      )
      .digest('hex')
      .toUpperCase();

    if (md5sig !== expectedSig) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Find the payment record
    const payment = await Payment.findOne({ paymentId: order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // status_code: 2 = success, 0 = pending, -1 = cancelled, -2 = failed
    const statusMap = { '2': 'success', '0': 'pending', '-1': 'cancelled', '-2': 'failed' };
    const newStatus = statusMap[String(status_code)] || 'failed';

    payment.status = newStatus;
    payment.transactionDetails.payment_id = payment_id;
    payment.transactionDetails.message = message;
    payment.updatedAt = Date.now();
    await payment.save();

    // Update the linked Order
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = newStatus === 'success' ? 'paid' : 'failed';
      order.paymentId = payment_id;
      if (newStatus === 'success') order.status = 'processing';
      order.updatedAt = Date.now();
      await order.save();
    }

    res.status(200).send('OK');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// VERIFY PAYMENT STATUS
// ─────────────────────────────────────────────

exports.verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId })
      .populate('orderId', 'orderId status totalAmount');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Only let the owner or admin check
    if (
      payment.customerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET MY PAYMENTS (customer)
// ─────────────────────────────────────────────

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.user.id })
      .populate('orderId', 'orderId status totalAmount')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET ALL PAYMENTS (admin)
// ─────────────────────────────────────────────

exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('customerId', 'fullName email')
      .populate('orderId', 'orderId totalAmount')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      payments,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};