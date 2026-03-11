const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authorize');

router.post('/login', protect('user.manage'), authController.login);

module.exports = router;