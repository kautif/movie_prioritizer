const router = require('express').Router();
const passport = require('passport');
// auth-login

router.get('/login', (req, res) =>{

	// Corresponds with login.ejs file which has not been created yet.
	// ejs file needs to be in 'views' folder which should be located at root of this project
	res.render('login');
});

router.get('/logout', (req, res) => {
	// handle with passport
		res.send('logging out');
});

// auth with google

router.get('/google', passport.authenticate('google', {
	scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect('/profile/');
});

module.exports = router;