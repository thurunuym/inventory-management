const express = require('express');
const router = express.Router();
const borrowCtrl = require('../controllers/borrowController');
const protect = require('../middleware/authorize');

router.post('/borrow', protect('borrow.manage'), borrowCtrl.borrowItem);
router.post('/return/:record_id', protect('borrow.manage'), borrowCtrl.returnItem);

module.exports = router;