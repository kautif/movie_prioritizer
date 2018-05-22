const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const MovieSchema = new Schema({
	title: String,
	rating: Number,
	release: String,
	position: Number
});

const UserSchema = new Schema({
	username: String,
	googleID: String,
	movies: [MovieSchema]
});

const User = mongoose.model('user', UserSchema);

module.exports = User; 