const mongoose = require('mongoose');

// Shortcut to create schema
const Schema = mongoose.Schema;


// Sets schema for Mario character objects
const MovieSchema = new Schema({
	title: String,
}, {usePushEach: true});

// Creates Mario character collection and sets it to follow MarioCharSchema

const Movie = mongoose.model('movie', MovieSchema);

// Allows mariochar collection to be accessed elsewhere.

module.exports = Movie;