// models/Food.js

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  // ✅ FIX IMPORTANT: catégorie libre (plus de enum)
  category: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  image: {
    type: String, // URL image
    required: true
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 0,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  isAvailable: {
    type: Boolean,
    default: true
  },

  preparationTime: {
    type: Number,
    default: 30
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Food', foodSchema);