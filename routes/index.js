var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('got request: ' + JSON.stringify(req.url,null,2));
  res.render('index', { title: 'Express' });
});

module.exports = router;
