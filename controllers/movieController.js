const User = require('../models/user');

module.exports = {
	getMovies(request, response) {
		User.find({}, function (err, data) {
			if (err) throw err;
			response.send({ movies: data });
		});
	},
	addMovie(request, response) {
		const newMovie = new Movie(request.body);
		newMovie.save()
			.then((movie) => response.json(movie))
			.catch((error) => console.log(error));
	},
	deleteMovie(request, response) {
		// findById?
		User.find({ movies: request.params })
			.remove()
			.then((movie) => response.json({movies: movie}))
			.catch((error) => console.log(error));
	}
};