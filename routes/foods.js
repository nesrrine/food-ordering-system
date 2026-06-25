// routes/foods.js
const express = require('express');
const { getAllFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', auth, adminAuth, createFood);    // ← createFood + auth avant adminAuth
router.patch('/:id', auth, adminAuth, updateFood); // ← auth avant adminAuth
router.delete('/:id', auth, adminAuth, deleteFood);

module.exports = router;