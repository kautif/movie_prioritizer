const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const should = chai.should();
const User = require('../models/user');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);
console.log(User);
function tearDownDb(){
  return new Promise((resolve, reject) => {
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// 1. Drop all database collections, starting from a new state
// 2. Create some mock movie objects
// 3a. Create an initial user *
// 3b. Check Users collection has grown by one
// 4. Test default user state for movies array
// 5. Add movie
// 6. Delete movie
// 7. Test re-ordering of movies
// 8. Prevent duplicates from being saved
// 9. Get movies list
// 10. Test that movies are appended to the collection
// 
// If this was an integration test, you could also:
// X. Test title truncation
// X. Test default cover image when missing


describe('/profile/mylist Movies', function() {
  before(function () {
    return runServer(TEST_DATABASE_URL);
    // return tempServer
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });
  
  it('should create a user', function() {
  	// chai.request(app)
  		User.findOne({googleID: '112119539588021196324'})
  		.then((currentUser) => {
  			if(currentUser) {
          console.log('CURRENT USER', currentUser);
	  			currentUser.should.be.a('object');
          currentUser.should.have.property('username', 'googleID', 'movies');
        } else {

	  		new User({
	  			username: 'Autif Kamal',
	  			googleID: '112119539588021196324',
	  			movies: []
	  		}).save().then((newUser) => {
          console.log('NEW USER: ', newUser);
	  			newUser.should.be.a('object');
          newUser.should.have.property('username', 'googleID', 'movies');
	  		});
		  // User.findOne({user: {googleID: '112119539588021196324'}}, (err, res) => {
		  // 	console.log('found user: ', res);
		  // });
	  		}
  		});
  });

  it('should PUT a movie', function() {
    return chai.request(app)
      User.findById('5b0a0d22bdc5fd230c2d01f4', (err, res) => {
        console.log(res);
      })
      .put('/profile/movies')
      .then((err, res) => {
        console.log('PUT error', err);
        // console.log(res);
        res.should.have.status(200)
        // console.log('added movies response', res);
      });
  });

  it('should GET all movies', function() {
    chai.request(app)
      .get('/profile/mylist')
      // .set('Content-Type', 'application/json')
      // .set('Accept', 'application/json')
      .then((err, res) => {
        // console.log('error', err)
        res.should.have.status(200)
        // expect(res).to.have.status(200);
        // res.body.movies.length.should.be.eql(0);
      });
  });
});

// I think the server needs to run before tests are initiated and...
// the server needs to be closed once tests are done.

// What should you test for?
  // Assigned Google ID upon sign up
  // Return all movies in list
  // Save new position of movies in list
    // Create fake movie data, save it, and delete it?
  // Delete movie in list