const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/authorize')

router.post('/', protect('user.manage'), userController.createUser);
router.get('/users', protect('user.manage'), userController.getAllUsers);

module.exports = router;