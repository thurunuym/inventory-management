const express = require('express');
const router = express.Router();
const itemCtrl = require('../controllers/itemController');
const storageCtrl = require('../controllers/storageController');
const protect = require('../middleware/authorize');

// Storage
router.post('/cupboards', protect('storage.manage'), storageCtrl.createCupboard);
router.post('/places', protect('storage.manage'), storageCtrl.createPlace);

// Items
router.post('/items', protect('item.create'), itemCtrl.createItem);
router.patch('/items/:id/quantity', protect('item.update'), itemCtrl.updateQuantity);

module.exports = router;