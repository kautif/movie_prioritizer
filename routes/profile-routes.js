const router = require('express').Router();

const authCheck = (req, res, next) => {
	console.log(req.user);
	if (!req.user) {
		res.redirect('/auth/login');
	} else {
		next();
	}
};

router.get('/', authCheck, (req, res) => {
	// res.send('logged in as ' + req.user.username);
	res.render('profile', {user: req.user});
});

router.get('/movies', (req, res) => {
	res.render('movies');
});

module.exports = router;