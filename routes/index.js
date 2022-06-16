var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('index', { layout: "main_layout.hbs" })
});

router.get('/admin-login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/admin/dashboard')
  } else {
    res.render('admin/admin_login', { layout: "login.hbs", loginError: req.session.loginError });
    req.session.loginError = false
  }
});

router.get('/login', (req, res) => {
  res.render('user/user_login', { layout: "login.hbs" });
});

router.get('/register', (req, res) => {
  res.render('user/user_reg', { layout: "login.hbs" });
});




module.exports = router;
