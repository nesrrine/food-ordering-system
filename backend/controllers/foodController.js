// controllers/foodController.js
const Food = require('../models/Food');

// GET /api/foods — public, with filters
exports.getAllFoods = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = { isAvailable: true };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const foods = await Food.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Food.countDocuments(filter);

    res.status(200).json({
      success: true,
      foods,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/foods/:id — public
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.status(200).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/foods — admin only (used in adminController)
exports.createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({ success: true, message: 'Food created successfully', food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/foods/:id — admin only
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.status(200).json({ success: true, message: 'Food updated successfully', food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/foods/:id — admin only
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.status(200).json({ success: true, message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};