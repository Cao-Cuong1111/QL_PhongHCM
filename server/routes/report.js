const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/summary', [verifyToken], controller.getSummary);

module.exports = router;
