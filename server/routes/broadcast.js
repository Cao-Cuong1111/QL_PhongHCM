const express = require('express');
const router = express.Router();
const controller = require('../controllers/broadcastController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.findAll);

// Admin only
router.post('/', [verifyToken, isAdmin], controller.create);
router.delete('/:id', [verifyToken, isAdmin], controller.delete);
router.patch('/:id/toggle', [verifyToken, isAdmin], controller.toggleActive);

module.exports = router;
