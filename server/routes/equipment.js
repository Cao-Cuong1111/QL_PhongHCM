const express = require('express');
const router = express.Router();
const controller = require('../controllers/equipmentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.findAll);
router.get('/:id', verifyToken, controller.findOne);

// Admin only
router.post('/', [verifyToken, isAdmin], controller.create);
router.put('/:id', [verifyToken, isAdmin], controller.update);
router.delete('/:id', [verifyToken, isAdmin], controller.delete);

module.exports = router;
