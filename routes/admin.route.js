const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

// Enable rate limiter
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 1 // limit each IP to 1 requests per windowMs 
});

router.post('/loadStations', limiter, adminController.loadStations);
router.all('/dummy', adminController.dummy);

module.exports = router;
