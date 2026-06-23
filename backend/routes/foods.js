const express = require('express');
const { getAllFoods, getFoodById, addFood, updateFood, deleteFood } = require('../controllers/foodController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', adminAuth, addFood);
router.patch('/:id', adminAuth, updateFood);
router.delete('/:id', adminAuth, deleteFood);

module.exports = router;