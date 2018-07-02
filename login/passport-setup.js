const passport = require('passport');
// Add bcrypt
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20');
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

passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
    	console.log('username: ', username);
    	console.log('password: ', password);
        // asynchronous
        // User.findOne wont fire unless data is sent back

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ username :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, { message: 'That email is already taken.'});
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.username = username;
                newUser.password = password;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

    }));

passport.use('local-login', new LocalStrategy(
    function(username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ username :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, { message:  'No user found.'}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (user.password !== password)
                return done(null, false, { message:  'Incorrect password.'}); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));