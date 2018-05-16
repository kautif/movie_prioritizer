const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');
// const search = require('../public/js/search').movieList;

// Puts mongodb id associated with specific user into cookie
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// Finds user by mongoid. Then, return user. Use some console logs for more details. 
passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});


	passport.use(new GoogleStrategy( {
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientId, 
		clientSecret: keys.google.clientSecret}, 
		(access, refresh, profile, done) => {
		User.findOne({googleID: profile.id})
			.then((currentUser) => {
				if (currentUser) {
					done(null, currentUser);	
				} else {
					new User({
						username: profile.displayName,
						googleID: profile.id,
						movies: []
					}).save().then((newUser) => {
						done(null, newUser);
					});
				}
			});		
}));