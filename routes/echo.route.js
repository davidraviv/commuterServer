const express = require('express');
const router = express.Router();

const echoController = require('../controllers/echo.controller');

router.all('/', echoController.allEcho);

module.exports = router;