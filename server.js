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
// const search = require('./public/js/search');

const User = require('./models/user');
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

// mongoose.connect(keys.mongodb.URI)
//         .then(() => console.log('Connected to database'))
//         .catch(() => console.log('Failed to connect to database'));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

// if (process.env.TEST === 'test') {
// 	mongoose.connect('mongodb://localhost/test-movie-prioritizer', 
// 		{useMongoClient: true});
// }
let server; 

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// Add a movie to list
app.put('/profile/movies', urlencodedParser, (req, res) => {
	// If not signed in, redirect to login. Create function for multiple places. 
	User.findById((req.body.user._id) ? req.body.user._id : req.user._id, (err, user) => {
		if (err) {
			res.status(400).json(err);
		}
		// const {movies} = data;
		console.log('id in PUT', req.body.user._id)
		user.movies.push(req.body);
		// data.movies = req.body.movieList;
		// data.movies = movies;
		user.save((err, d) => {
			res.json();
			console.log(d);
		});
	});
});

app.put('/profile/mylist', urlencodedParser, (req, res) => {

	User.findById(req.user._id, (err, user) => {

		//
		// First, loop through each movie for the
		// current user.
		//
		for(let j = 0; j < user.movies.length; j++) {

			let newPosition = 0;

			//
			// Loop through positions array sent from the frontend
			// to find the index that matches the movie._id
			//
			for(let position = 1; position < req.body.positions.length; position++) {
				if( req.body.positions[position] == user.movies[j]._id) {
					newPosition = position;
					break;
				}
			}
			user.movies[j].position = newPosition;
		}

		user.save();

	res.status(201).send('done');
	});




})
// process.env.TEST_DATABASE_URL ? '5b05eb04f66010215024ac29' : req.user._id
app.get('/profile/mylist', urlencodedParser, function(req, res){
		User.findById('5b0a0d22bdc5fd230c2d01f4', (err, user) => {
		console.log('USER ID', user);
		if (err) {
			res.status(400).json(err);
		}
		// res.send({	
		// 	movies: user.movies.sort((a, b) => {
		// 		return a.position - b.position;
		// 	}),			
		// 	user: user
		// });
	
		res.render('mylist', {
			movies: user.movies.sort((a, b) => {
				console.log(res);
				return a.position - b.position;
			}),
			user: user
		});
	});
});

// Delete a movie from your list

app.delete('/profile/mylist/:item', urlencodedParser, (req, res) => {
		// First authenticate user prior to deletion. Only user should be able to delete own movies. 
		User.findOneAndUpdate({"movies._id": req.params.item}, {$pull:{movies: {_id:req.params.item } }}, function(err, user){
			
			if (err) throw err;
			// Send response of deleted item and updated movie list.
			res.json(user);
		});
});

app.get('/', function(req, res){
	res.render('home');
});

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
