// controllers/adminController.js

const User = require('../models/User');
const Food = require('../models/Food');
const Order = require('../models/Order');
const Payment = require('../models/Payment');


// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalFoods, payments] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Food.countDocuments(),
      Payment.find({ status: 'success' })
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'fullName email');

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalFoods,
        totalRevenue: Number(totalRevenue.toFixed(2))
      },
      recentOrders,
      ordersByStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─────────────────────────────────────────────
// USERS MANAGEMENT
// ─────────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, phone, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phone,
        role,
        isActive,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─────────────────────────────────────────────
// FOOD MANAGEMENT (FIXED)
// ─────────────────────────────────────────────

exports.createFood = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Body is empty'
      });
    }

    const food = await Food.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Food created successfully',
      food
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ FIX IMPORTANT (TON BUG 500 ÉTAIT ICI)
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID:", id);
    console.log("BODY:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty'
      });
    }

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // update safe fields only
    const allowedFields = [
      'name',
      'price',
      'image',
      'category',
      'description',
      'available'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        food[field] = req.body[field];
      }
    });

    food.updatedAt = new Date();

    const updatedFood = await food.save();

    res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      food: updatedFood
    });

  } catch (error) {
    console.error("UPDATE FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─────────────────────────────────────────────
// ORDER MANAGEMENT
// ─────────────────────────────────────────────

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('customerId', 'fullName email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = [
      'pending',
      'processing',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      notes: notes || ''
    });

    order.status = status;
    order.updatedAt = new Date();

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};