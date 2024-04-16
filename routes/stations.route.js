const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const stationsController = require('../controllers/stations.controller');

// Enable rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 2 // limit each IP requests per windowMs 
});

router.get('/', limiter, stationsController.getStations);

module.exports = router;
