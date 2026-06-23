// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    // After auth middleware runs, check if admin
    User.findById(req.user.id)
      .then(user => {
        if (user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Admin access required'
          });
        }
        next();
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: error.message
        });
      });
  });
};

module.exports = { auth, adminAuth };