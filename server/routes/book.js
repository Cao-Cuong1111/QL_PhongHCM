const express = require('express');
const router = express.Router();
const books = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes (or User role)
router.get('/', verifyToken, books.findAll);
router.get('/:id', verifyToken, books.findOne);

// Admin only routes
router.post('/', [verifyToken, isAdmin], books.create);
router.put('/:id', [verifyToken, isAdmin], books.update);
router.delete('/:id', [verifyToken, isAdmin], books.delete);

module.exports = router;
