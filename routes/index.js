var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testSession', function(req, res) {
  if(req.session.number == 'undefined') {
    req.session.number = 0;
  }

  req.session.number++;

  res.send('Session has the number: ' + req.session.number);
});

router.get('/showNumberSession', function(req, res) {
  res.send('Session has the number: ' + req.session.number);
});

module.exports = router;
