const express = require('express');
const router = express.Router();
const controller = require('../controllers/borrowReturnController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get all records (User sees own, Admin sees all/filter)
router.get('/', verifyToken, controller.findAll);

// Borrow Book (Admin or User can initiate? Usually Admin does checks, but let's allow User to register borrow request or Admin to do it directly. For now: Authenticated User)
// For Military context: Usually Admin records it. Let's allow Admin for now to keep it simple and controlled.
router.post('/borrow', [verifyToken, isAdmin], controller.borrowBook);

// Return Book (Admin only)
router.post('/return/:id', [verifyToken, isAdmin], controller.returnBook);

module.exports = router;
