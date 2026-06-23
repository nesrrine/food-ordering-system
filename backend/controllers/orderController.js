// controllers/orderController.js
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Food = require('../models/Food');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, customerPhone, specialInstructions } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    // Calculate totals
    let subtotal = 0;
    for (let item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food item ${item.foodId} not found`
        });
      }
      subtotal += food.price * item.quantity;
    }

    const tax = subtotal * 0.08; // 8% tax
    const deliveryCharge = 5.49;
    const totalAmount = subtotal + tax + deliveryCharge;

    // Generate order ID
    const orderId = `ORD-${Date.now()}`;

    // Create order
    const order = await Order.create({
      orderId,
      customerId: req.user.id,
      items: items.map(item => ({
        ...item,
        foodId: item.foodId
      })),
      deliveryAddress,
      customerPhone,
      specialInstructions,
      subtotal,
      tax,
      deliveryCharge,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};