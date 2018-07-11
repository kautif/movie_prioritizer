const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth-routes.js');
const profileRoutes = require('./routes/profile-routes.js');

const passportSetup = require('./login/passport-setup');
// const keys = require('./login/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
// const search = require('./public/js/search');

const User = require('./models/user');
const MovieController = require('./controllers/movieController');

const flash = require('connect-flash');

mongoose.Promise = global.Promise;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: ['keys.session.cookieKey']
}));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const { PORT, DATABASE_URL } = require('./config');

// mongoose.connect(keys.mongodb.URI)
//         .then(() => console.log('Connected to database'))
//         .catch(() => console.log('Failed to connect to database'));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


// if (process.env.TEST === 'test') {
// 	mongoose.connect('mongodb://localhost/test-movie-prioritizer', 
// 		{useMongoClient: true});
// }
let server; 

function runServer(dbUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
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
app.put('/profile/movies', (req, res) => {
	// If not signed in, redirect to login. Create function for multiple places. 
		let user = req.user;

		if(!user) {
			return res.sendStatus(400);
		}
		// console.log(req.body);

		const {title, rating, release, tmdbID} = req.body;

		if (user.movies.some(element => element.tmdbID == tmdbID)) {
			return res.sendStatus(400);
		}

		user.movies.push({title, rating, release, tmdbID});

		user.save((err, d) => {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			res.sendStatus(200);
			console.log(d);
		});

	// User.findById((req.user._id), (err, user) => {
	// 	// console.log('server.js req.body Line 90: ', req.body.title)
	// 	if(User.find({"title": req.body.title, "rating": req.body.rating, "release": req.body.release})) {
	// 		return
	// 	} else {
	// 		user.movies.push(req.body);
	// 		user.save((err, d) => {
	// 			res.json();
	// 			// console.log(d);
	// 		});
	// 	}
	// 	if (err) {
	// 		res.status(400).json(err);
	// 	}
	// });
});

app.put('/profile/mylist', (req, res) => {

	User.findById(req.user._id, (err, user) => {
		// User.find({req.user.movies.title, req.user.movies.rating, req.user.movies.release})
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
app.get('/profile/mylist', function(req, res){
		User.findById(req.user._id, (err, user) => {
		// console.log('req', req);
		// console.log('req.user: ', req.user);
		if (err) {
			res.status(400).json(err);
		}
		// res.send({	
		// 	movies: user.movies.sort((a, b) => {
		// 		return a.position - b.position;
		// 	}),			
		// 	user: user
		// });
	
		if (req.accepts('text/html')) {
			console.log('else');
			res.render('mylist', {
				movies: user.movies.sort((a, b) => {
					// console.log(res);
					return a.position - b.position;
				}),
				user: user
			});
		} else {
			res.json(user.movies);
		}

	});
});

app.get('/profile/mylist/json', function(req, res) {
	User.findById(req.user._id, (err, user) => {
		if (err) {
			res.status(400).json(err);
		}

		res.json(req.user.movies);
	});
});

// Delete a movie from your list

app.delete('/profile/mylist/:item', (req, res) => {
		// console.log('hi');
		// First authenticate user prior to deletion. Only user should be able to delete own movies. 
		User.findOneAndUpdate({"movies._id": req.params.item}, {$pull:{movies: {_id:req.params.item } }}, function(err, user){
			
			if (err) throw err;
			// Send response of deleted item and updated movie list.
			// console.log('Line 172: ', user);
			res.status(204)
			.end();
		});
});

app.get('/', function(req, res){
	res.render('home');
});

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
