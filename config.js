'use strict';
const DATABASE_URL = 'mongodb://localhost:27017/movie-prioritizer3';
const TEST_DATABASE_URL = 'mongodb://localhost:27017/test-movie-prioritizer3';
const PORT = process.env.PORT || 8080;

module.exports = {
    DATABASE_URL,
    TEST_DATABASE_URL,
    PORT
};