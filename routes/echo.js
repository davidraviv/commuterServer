var express = require('express');
var router = express.Router();

/* GET users listing. */
router.all('*', function(req, res, next) {
  res.send({
      status: "ok",
      method: req.method,
      url: req.url,
      query: req.query,
      headers: req.headers,
      body: req.body,
      });
});

module.exports = router;
