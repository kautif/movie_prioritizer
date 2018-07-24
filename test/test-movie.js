'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const User = require('../models/user');
const { PORT, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

// declare authenticatedUser variable

describe('Movie Repository', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function() {
    return bcrypt.hash(password, 10).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
      // https://codeburst.io/authenticated-testing-with-mocha-and-chai-7277c47020b7: Look at Writing Tests section
      // .then(() => {
        // authenticatedUser = request.agent(app)
        // login authenciatedUser
      // })
    );
  });

  afterEach(function () {
    return User.remove({username: 'exampleUser'});
  });

  let movieX = {
        title: 'Return of the Movie',
        rating: 90,
        release: '2018-09-17',
        position: 1
    };

  let movieY = {
        title: 'The Last Movie',
        rating: 65,
        release: '2018-12-21',
        position: 2
    };

  // 1. Check that movies array is empty on user.
  // 3. POST movie to user movies array and GET movies list
  // 4. POST movie to user movies array, GET user movies list, PUT movies list with an additional movie, GET movies list again.
  // 5. Delete movie from user movies array and GET movies list. 
  // 6. Reorder movies list and GET movies list. 
  // 7. Reject saving movies containing the same rating, release, and rating. 
  // 8. Give status of 404 if form submitted with no data.
  // 9. Give status of 404 if form submitted with malformed data. 

// Can't get movies to save to database for some reason.

// Con't *** Test for invalid chars in username and password but only for signup. 
  // Test for accessing movies list while not logged in. Status should be a 200 since it will redirect to login. 

  describe('GET profile/mylist', function() {
    it('Should retrieve empty movie array for user', function () {
      var agent = chai.request.agent(app)
      return agent
        .post('/auth/login')
        .send({ username, password})
        .then(function (res) {
          // The `agent` now has the sessionid cookie saved, and will send it
          // back to the server in the next request:
          return agent.get('/profile/mylist')
            .then(function (res) {
              // res.body is empty.
               expect(res).to.have.status(200);
            });
        });
    });
  });

  describe('PUT /profile/movies', function () {
    it('Should update movies array to add one movie', function() {
        
        var agent = chai.request.agent(app)
      return agent
        .post('/auth/login')
        .send({ username, password})
        .then((err, res) => {
          return User.findOne({})
            .then(updatedUser => {
              updatedUser.movies.push(movieX);
              updatedUser.save((err, result) => {
              });
              expect(updatedUser.movies.length).to.equal(1);
            });
        });
          return agent.get('/profile/movies')
            .then(function (res) {
               expect(res).to.have.status(200);
            });
        });      
    });

    it('Should GET user movies list', function() {
      
      var agent = chai.request.agent(app)
      return agent
        .post('/auth/login')
        .send({ username, password})
        .then((err, res) => {
          return User.findOne({})
            .then(updatedUser => {
          updatedUser.movies.push(movieX);
          updatedUser.save((err, result) => {
            // console.log(result);
          });
          // console.log("User after adding movie: ", updatedUser);
          });
        });
          return agent.get('/profile/movies')
            .then((err, res) => {
          return User.findOne({})
            .then(updatedUser => {
              expect(updatedUser.movies.length).to.equal(1);
              // console.log("GET updatedUser: ", updatedUser);
            });
        });
    });

    // Test that movie has keys that its supposed to


    it('Add one more movie, and GET list again', function() {
      var agent = chai.request.agent(app)
      return agent
        .post('/auth/login')
        .send({ username, password})
        .then((err, res) => {
          return User.findOne({})
        .then(data => {
          console.log('line 154: ', data)
          data.movies.push(movieX);
          data.save((err,result) => {
              // console.log('line 144: ', result);
          });
          expect(data.movies.length).to.equal(1);
        });
      });
        return agent.get('/profile/mylist')
            .then((err, res) => {
          return User.findOne({})
            .then((err, res) => {
              return User.findOne({})
                .then(updatedUser => {
                  User.findOne({})
                    .then(data => {
                      data.movies.push(movieY);
                      data.save((err,result) => {
                        // console.log('line 161: ', result);
                      });
                      expect(data.movies.length).to.equal(2);
                    });
                  // console.log("GET updatedUser: ", updatedUser);
                });
            });
        });
    });

  describe('PUT profile/mylist', function() {
    it('Should change movie order of current movies in user list', function () {
      var agent = chai.request.agent(app)
      return agent
        .post('/auth/login')
        .send({ username, password})
        .then((err, res) => {
          return User.findOne({})
        .then(data => {
          data.movies.push(movieX, movieY);
          data.save((err,result) => {
              // console.log('line 144: ', result);
          });
          expect(data.movies.length).to.equal(2);
        });
      });
        return agent.get('/profile/mylist')
            .then((err, res) => {
          return User.findOne({})
            .then((err, res) => {
              return User.findOne({})
                .then(updatedUser => {
                  User.findOne({})
                    .then(data => {
                      data.movies.movieY.position = 1;
                      console.log('Line 211: ', data.movies.movieY);
                      data.movies.movieX.position = 2;
                      data.save((err,result) => {
                          // console.log('line 144: ', result);
                      });
                      expect(data.movies.movieY.position).to.equal(1);
                      expect(data.movies.movieX.position).to.equal(2);
                    });
                  // console.log("GET updatedUser: ", updatedUser);
                });
            });
        });
    });
  });

  describe('DELETE /profile/mylist/:item', function() {
    it('Should delete a movie from user movie array', function () {
      let movieID;

let user, movieId;

        var agent = chai.request.agent(app)
      return agent
        .post('/auth/login')
        .send({ username, password})
        .then((err, res) => {
          return User.findOne({})
        .then(data => {
          data.movies.push(movieX);
          data.save((err,result) => {
              // console.log('line 144: ', result);
          });
          expect(data.movies.length).to.equal(1);
        });
      })
        User.findOne({})
        .then((user) => {
          console.log('Line: 245: ', user);
          movieId = user.movies[0]._id;
          // console.log('Line 205: ', user);
          return agent.delete(`/profile/movies/${movieId}`)
            .then(function (res) {
              expect(data.movies.length).to.equal(0);
               expect(res).to.have.status(200);
            });
        }); 
    });
  }); 

  describe('POST /signup', function() {
    it('Should reject short usernames', function() {
      var agent = chai.request.agent(app)
      const username = 'user';
      return agent
        .post('/auth/signup')
        .send({username, password})
        .then(res => {
          // console.log('Line 266: ', res.text);
          expect(res.text).to.include('That username is not valid.');
          expect(res).to.have.status(200);
        });
    });
    
    it('Should reject short passwords', function() {
      var agent = chai.request.agent(app)
      const password = 'passwor';
      return agent
        .post('/auth/signup')
        .send({username, password})
        .then(res => {
          expect(res.text).to.include('That password is not valid');
          expect(res).to.have.status(200);
        });
    });    
  });

  describe('POST /login', function() {
    it('Should reject empty username field', function() {
      var agent = chai.request.agent(app)
      const username = '';
      return agent
        .post('/auth/login')
        .send({username, password})
        .then(res => {
          // console.log('Line 266: ', res.text);
          expect(res.text).to.include('<form name="signup" method="post" action="/auth/signup">');
          expect(res).to.have.status(200);
        });
    });


    it('Should reject invalid usernames', function() {
      var agent = chai.request.agent(app)
      const username = 'user.';
      return agent
        .post('/auth/login')
        .send({username, password})
        .then(res => {
          // console.log('Line 266: ', res.text);
          expect(res.text).to.include('<form name="signup" method="post" action="/auth/signup">');
          expect(res).to.have.status(200);
        });
    });

    it('Should reject empty password field', function() {
      var agent = chai.request.agent(app)
      const password = '';
      return agent
        .post('/auth/login')
        .send({username, password})
        .then(res => {
          expect(res.text).to.include('<form name="signup" method="post" action="/auth/signup">');
          expect(res).to.have.status(200);
        });
    });

    it('Should reject invalid passwords', function() {
      var agent = chai.request.agent(app)
      const password = 'passwor.';
      return agent
        .post('/auth/login')
        .send({username, password})
        .then(res => {
          expect(res.text).to.include('<form name="signup" method="post" action="/auth/signup">');
          expect(res).to.have.status(200);
        });
    });
  });

  // At least two more tests... One for a minimum number of chars for username (3?) and another minimum for password (6?);


});

// router.post('/users', (req, res) => {
//   User.create(req.params.user)
//     .then(user => {
//       res.status(201).json(user).end()
//     })
//     .catch(err => {
//       res.status(500).end()
//     });
// });