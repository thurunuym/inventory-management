const express = require('express');
const router = express.Router();
const storageCtrl = require('../controllers/storageController');
const protect = require('../middleware/authorize');


router.post('/cupboards', protect('storage.manage'), storageCtrl.createCupboard);
router.post('/places', protect('storage.manage'), storageCtrl.createPlace);
router.get('/storage', protect('storage.manage'), storageCtrl.getStorageMap);

module.exports = router;