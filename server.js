const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const MovieController = require('./controllers/movieController');

const app = express();
app.use(express.static('public'));

const { PORT, DATABASE_URL } = require('./config');
const { Movie } = require('./models/movie');

mongoose.Promise = global.Promise;


app.listen(process.env.PORT || 8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function(req, res){
	res.send('hello');
});

app.get('/pages/dashboard', MovieController.getMovies);

app.post('/pages/dashboard', MovieController.addMovie);

app.delete('/movies/:title', MovieController.deleteMovie);

module.exports = app;