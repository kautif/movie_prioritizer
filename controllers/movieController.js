const Movie = require('../models/movie');

module.exports = {
	getMovies(request, response) {
		Movie.find({}, function (err, data) {
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
		Movie.find({ title: request.params.title })
			.remove()
			.then((movie) => response.json(movie))
			.catch((error) => console.log(error));
	}
};