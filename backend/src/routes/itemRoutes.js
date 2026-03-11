const express = require('express');
const router = express.Router();
const itemCtrl = require('../controllers/itemController');
const protect = require('../middleware/authorize');

router.post('/items', protect('item.create'), itemCtrl.createItem);
router.patch('/items/:id/quantity', protect('item.update'), itemCtrl.updateQuantity);
router.get('/items', protect('item.view'), itemCtrl.getAllItems);

module.exports = router;