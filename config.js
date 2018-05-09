'use strict';
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/movie-prioritizer';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-movie-prioritizer';
const PORT = process.env.PORT || 8080;

module.exports = {
    DATABASE_URL,
    TEST_DATABASE_URL,
    PORT
};