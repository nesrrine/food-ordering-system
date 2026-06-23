// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    foodId: mongoose.Schema.Types.ObjectId,
    foodName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String
  },
  customerPhone: String,
  customerEmail: String,
  specialInstructions: String,
  subtotal: Number,
  tax: Number,
  deliveryCharge: Number,
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);