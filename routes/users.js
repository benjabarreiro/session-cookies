var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersControllers');
const {check, validationResult, body} = require('express-validator');
const fs = require('fs');
const guestMiddleware = require('../middlewares/guestMiddleware');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', guestMiddleware, usersController.register);

router.post('/register', [
  check('username').isLength({min: 1}).withMessage('The field username must be completed.'),
  check('email').isEmail().withMessage('The email must be a valid email.'),
  check('password').isLength({min: 6}).withMessage('The password must have a length of at least 6.'),
  body('email').custom(function(value) {
    let usersJson = fs.readFileSync('users.json', {encoding: 'utf-8'});
    let users;
    if(usersJson == "") {
      users = [];
    } else {
      users = JSON.parse(usersJson);
    }

    for(let i=0; i<users.length; i++) {
      if(users[i].email == value) {
        return false;
      }
    }
    return true;
  }).withMessage('User already exists')
], usersController.store);

router.get('/login', usersController.login);

router.post('/login', [
  check('email').isEmail().withMessage('Invalid email')
], usersController.processLogin);

router.get('/check', function(req, res) {
  if(req.session.userLogged == undefined) {
    res.send('Your not logged in.');
  } else {
    res.send('The user logged in is: ' + req.session.userLogged.email);
  }
})

module.exports = router;
