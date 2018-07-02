const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

// auth-login

router.post('/signup', passport.authenticate('local-signup', { successRedirect: '/',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false }));

router.post('/login', passport.authenticate('local-login', { successRedirect: '/',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false }));

router.get('/login', (req, res) =>{

	// Corresponds with login.ejs file which has not been created yet.
	// ejs file needs to be in 'views' folder which should be located at root of this project
	res.render('login');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;