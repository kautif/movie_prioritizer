const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');
// const flash = require('connect-flash');
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

const saltRounds = 10;

function validPassword(password){
    if(!password) {
        return false;
    }

    if (password.length < 8){
        return false;
    }

    return password.match(/^[A-Za-z0-9]*$/) !== null;
}

function validUsername(username){
    if (!username) {
        return false;
    }

    if (username.length < 5) {
        return false;
    }

    return username.match(/^[A-Za-z0-9]*$/) !== null
}

passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
    	console.log('username: ', username);
    	console.log('password: ', password);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        if(!validUsername(username)) {
            return done(null, false, {message: 'Username must be at least 5 characters and letters or numbers only.'})
        }

        if(!validPassword(password)) {
            return done(null, false, { message: 'Password must be at least 8 characters and letters or numbers only.'})
        }
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ username :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, { message: 'That username is already taken.'});
            } else {

                bcrypt.hash(password, saltRounds, function(err, hash) {
                  // Store hash in your password DB.
                    // if there is no user with that email
                    // create the user
                    if (err)
                        return done(err);

                    var newUser = new User();

                    // set the user's local credentials
                    newUser.username = username;

                    // password supposed to be hash, but if hash is longer than password length requirement 
                    // and has more than alphanumeric chars, password will be rejected.
                    newUser.password = hash;

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
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
            bcrypt.compare(password, user.password, function(err, res) {
                if (err) 
                    return done(err);

                if (res) 
                    return done(null, user);

                return done(null, false, { message:  'Incorrect password.'}); // create the loginMessage and save it to session as flashdata

                 
            });

        });

    }));