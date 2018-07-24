const router = require('express').Router();

const authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect('/auth/login');
	} else {
		next();
	}
};

router.use(authCheck);

router.get('/', (req, res) => {
	// res.send('logged in as ' + req.user.username);
	res.render('profile', {user: req.user});
});

router.get('/movies', (req, res) => {
	res.render('movies');
});

module.exports = router;