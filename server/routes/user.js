const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes require Admin role
router.get('/', [verifyToken, isAdmin], controller.findAll);
router.get('/:id', [verifyToken, isAdmin], controller.findOne);
router.post('/', [verifyToken, isAdmin], controller.create);
router.put('/:id', [verifyToken, isAdmin], controller.update);
router.delete('/:id', [verifyToken, isAdmin], controller.delete);

module.exports = router;
