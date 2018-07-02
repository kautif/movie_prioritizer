'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Movie Repository', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function () {
    return User.remove({});
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

  describe.only('GET profile/mylist', function() {
    it('Should retrieve empty movie array for user', function () {
      // return User.findOne()
        // .then(data => {
        //   expect(data.movies).to.be.empty;
        // });

      return chai 
        .request(app)
        .get('/profile/mylist')
        .send({username: username, password: password})
        .then( res => {
          User.findOne()
            .then(data => {
              expect(data.movies).to.be.empty;
            });           
        });
    });
  });

  describe('PUT /profile/movies', function () {
    it('Should update movies array to add one movie', function() {
      // User.findOne()
      //   .then(data => {
      //   });

      return chai 
        .request(app)
        .put('/profile/movies')
        .send({username: username, password: password})
        .then((err, res) => {
          return User.findOne({})
            .then(updatedUser => {
              updatedUser.movies.push(movieX);
              updatedUser.save((err, result) => {
                // console.log(result);
              });
              expect(updatedUser.movies.length).to.equal(1);
              // console.log("User after adding movie: ", updatedUser);
            });
        });
    });

    it('Should GET user movies list', function() {
      return User.findOne({})
        .then(updatedUser => {
          updatedUser.movies.push(movieX);
          updatedUser.save((err, result) => {
            // console.log(result);
          });
          // console.log("User after adding movie: ", updatedUser);
        });

      return chai 
        .request(app)
        .get('/profile/mylist')
        .send({username: username, password: password})
        .then((err, res) => {
          return User.findOne({})
            .then(updatedUser => {
              expect(updatedUser.movies.length).to.equal(1);
              console.log("GET updatedUser: ", updatedUser);
            });
        });
    });


    it('Add one more movie, and GET list again', function() {
      User.findOne({})
        .then(data => {
          data.movies.push(movieX);
          data.save((err,result) => {
              console.log('line 144: ', result);
          });
          expect(data.movies.length).to.equal(1);
        });

      return chai
        .request(app)
        .get('/profile/mylist')
        .send({username: username, password: password})
        .then((err, res) => {
          return User.findOne({})
            .then(updatedUser => {
              User.findOne({})
                .then(data => {
                  data.movies.push(movieY);
                  data.save((err,result) => {
                    console.log('line 149: ', result);
                  });
                  expect(data.movies.length).to.equal(2);
                });
              // console.log("GET updatedUser: ", updatedUser);
            });
        });
    });
  });

// con't ***

  describe('PUT profile/mylist', function() {
    it('Should change movie order of current movies in user list', function () {
      return User.findOne({})
          .then((user) => {
            user.movies.push(movieX, movieY);
            console.log(user);
            return user.save();
        });

      return chai 
        .request(app)
        .put('/profile/mylist')
        .send({username: username, password: password})
        .then( res => {
          User.findOne()
            .then(data => {
              console.log('Line 186:', data)
            });           
        });
    });
  });

  describe('DELETE /profile/mylist/:item', function() {
    it('Should delete a movie from user movie array', function () {
      let movieID;

let user, movieId;

        return User.findOne({})
          .then((user) => {
            // Add and save movieX
            user.movies.push(movieX);
            return user.save();
        })
        .then((user) => {
          movieId = user.movies[0]._id;
          // console.log('Line 205: ', user);
          return chai.request(app)
            .delete(`/profile/mylist/${movieId.toString()}`)
            .send({username: username, password: password})
        })
        .then((result) => {
          expect(result).to.have.status(204);
        });
    });
  }); 

  describe('POST /login', function() {
    it('Should reject empty username field', function() {
      return chai 
        .request(app)
        .post('/login')
        .send({username: ''})
        .then( res => {
          expect(res).to.have.status(400);           
        });
    });

    it('Should reject empty password field', function() {
      return chai 
        .request(app)
        .post('/login')
        .send({password: ''})
        .then( res => {
          expect(res).to.have.status(400);           
        });
    });
  });

  describe.only('POST /login', function() {
    it('Should reject empty username field', function() {
      return chai 
        .request(app)
        .post('/login')
        .send({username: ''})
        .then( res => {
          expect(res).to.have.status(400);           
        });
    });

    it('Should reject empty password field', function() {
      return chai 
        .request(app)
        .post('/login')
        .send({password: ''})
        .then( res => {
          expect(res).to.have.status(400);           
        });
    });
  });
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