const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/authorize');

router.post('/', protect('user.manage'), userController.createUser);

module.exports = router;