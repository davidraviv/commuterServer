const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

// Enable rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3 // limit each IP to 3 requests per windowMs 
});

router.post('/loadStations', limiter, adminController.loadStations);
router.all('/dummy', adminController.dummy);

module.exports = router;
