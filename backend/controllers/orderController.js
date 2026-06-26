// controllers/orderController.js
const Order = require('../models/Order');
const Food = require('../models/Food');

// ─────────────────────────────────────────────
// CREATE ORDER
// ─────────────────────────────────────────────

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, customerPhone, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    // Calcul du total à partir des prix en base (ne jamais faire confiance au frontend)
    let subtotal = 0;
    for (let item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ success: false, message: `Food item ${item.foodId} not found` });
      }
      subtotal += food.price * item.quantity;
    }

    const tax = subtotal * 0.08;
    const deliveryCharge = 5.49;
    const totalAmount = subtotal + tax + deliveryCharge;

    // orderId lisible pour l'affichage (ex: ORD-1719123456789)
    const readableOrderId = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderId: readableOrderId,
      customerId: req.user.id,
      items: items.map(item => ({ foodId: item.foodId, quantity: item.quantity })),
      deliveryAddress,
      customerPhone,
      specialInstructions,
      subtotal,
      tax,
      deliveryCharge,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      // orderId ici = order._id (MongoDB ObjectId) → utilisé par initializePayment
      orderId: order._id,
      // readableId = ORD-xxxx → pour affichage dans l'UI
      readableId: order.orderId,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET MY ORDERS (customer)
// ─────────────────────────────────────────────

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET ORDER BY ID
// ─────────────────────────────────────────────

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Seul le propriétaire ou un admin peut voir la commande
    if (order.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};