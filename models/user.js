const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const MovieSchema = new Schema({
	title: String,
	rating: Number,
	release: String,
	position: Number,
	tmdbID: Number
});

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		default: ''
	},
	lastName: {
		type: String,
		default: ''
	},
	movies: [MovieSchema]
});

const User = mongoose.model('user', UserSchema);

module.exports = User; 