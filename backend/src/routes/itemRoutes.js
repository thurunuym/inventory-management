const express = require('express');
const router = express.Router();
const itemCtrl = require('../controllers/itemController');
const protect = require('../middleware/authorize');

router.post('/upload', protect('item.create'), itemCtrl.uploadImage);
router.post('/items', protect('item.create'), itemCtrl.createItem);
router.patch('/items/:id/quantity', protect('item.update'), itemCtrl.updateQuantity);
router.get('/items', protect('item.view'), itemCtrl.getAllItems);
router.delete(`/items/:id`, protect('item.delete'), itemCtrl.deleteItem);
router.patch('/items/:id/status', protect('item.update'), itemCtrl.updateStatus);

module.exports = router;