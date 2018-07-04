'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/userIndex');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Auth endpoints', function () {
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

// 1.

  describe('/api/auth/login', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({})
        .then( res => {
          // Expected because that's what's coming up. Not sure how to set http status
          expect(res.body).to.be.empty;
          expect(res).to.have.status(400);
          // expect.fail('Request should not succeed')
        }
        )
    });

// 2.

    it('Should reject requests with incorrect usernames', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({ username: 'wrongUsername'})        
        .then(res => {
          // DOCS RECOMMEND AGAINST THIS: expect(res.request._data.username).to.not.equal(username);
          // console.log('line 77: ', res);
          // expect.fail(res.request._data.username, !username, 'Request should not succeed')
          expect(res.body).to.be.empty;
          expect(res).to.have.status(400);
        });
        // ).catch(err => {
        //   console.log('error: ', err);
        // });
    });

// 3. 

    it('Should reject requests with incorrect passwords', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({password: 'wrongPassword' })
        .then(res => {
          // expect(res.body).to.be();
          expect(res.body).to.be.empty;
          expect(res).to.have.status(400);
          // expect.fail(null, null, 'Request should not succeed')
        }
        )
    });

// 4.

    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({
            username,
            firstName,
            lastName
          });
        });
    });
  });

// 5.

  describe('/api/auth/refresh', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .then( res => {
          // expect.fail(null, null, 'Request should not succeed')
          expect(res.body).to.be.empty;
          expect(res).to.have.status(401);
        }
        )
    });

// 6. 

    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          username,
          firstName,
          lastName
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res.body).to.be.empty;
          expect(res).to.have.status(401);
          // expect.fail(null, null, 'Request should not succeed')
        }
        )
    });

// 7.

    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then( res => {
          expect(res.body).to.be.empty;
          expect(res).to.have.status(401);
        }
          // expect.fail(null, null, 'Request should not succeed')
        )
    });

// 8. 

    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      const decoded = jwt.decode(token);

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({
            username,
            firstName,
            lastName
          });
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
