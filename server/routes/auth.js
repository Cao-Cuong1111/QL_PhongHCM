const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);

// Example protected route for testing
router.get('/me', verifyToken, (req, res) => {
    res.json({ message: 'User content.', userId: req.userId, role: req.userRole });
});

module.exports = router;
