const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authorize');

router.post('/login', authController.login);

module.exports = router;