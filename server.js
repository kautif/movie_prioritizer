const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth-routes.js');
const profileRoutes = require('./routes/profile-routes.js');

const passportSetup = require('./login/passport-setup');
const keys = require('./login/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const User = require('./models/user');
// const search = require('./public/js/search');


const MovieController = require('./controllers/movieController');

mongoose.Promise = global.Promise;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: ['keys.session.cookieKey']
}));

app.use(passport.initialize());
app.use(passport.session());

const { PORT, DATABASE_URL } = require('./config');

mongoose.connect(keys.mongodb.URI)
        .then(() => console.log('Connected to database'))
        .catch(() => console.log('Failed to connect to database'));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.render('home');
});

app.get('/mylist', function(req, res){

});

app.put('/profile/movies', urlencodedParser, (req, res) => {
	// console.log(req);
	User.findById(req.user._id, (err, data) => {
		if (err) {
			res.status(400).json(err);
		}
		const {movies} = data;
		movies.push(req.body.movieTitle);
		data.movies = movies;
		data.save(() => {
			res.json();
		});
	});

	// let newMovie = User(req.body).save(function(err, data){
	// 	if(err) throw err;
	// 	res.json(data);
	// });
});

app.listen(process.env.PORT || 8080);

module.exports = app;