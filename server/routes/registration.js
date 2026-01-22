const express = require('express');
const router = express.Router();
const controller = require('../controllers/registrationController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.findAll);
router.post('/', verifyToken, controller.create);
router.delete('/:id', verifyToken, controller.delete);

// Admin only
router.patch('/:id/status', [verifyToken, isAdmin], controller.updateStatus);

module.exports = router;
