// routes/auth.js
const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { auth, checkActive } = require('../middleware/auth');

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.post('/register', register);
router.post('/login', login);

// ================= PROTECTED ROUTES =================
// ✅ IMPORTANT: Ajoute checkActive pour vérifier que l'utilisateur est actif
router.get('/profile', auth, checkActive, getCurrentUser);
module.exports = router;