const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const MovieController = require('./controllers/movieController');

mongoose.Promise = global.Promise;

const app = express();
const { PORT, DATABASE_URL } = require('./config');

mongoose.connect(DATABASE_URL)
        .then(() => console.log('Connected to database'))
        .catch(() => console.log('Failed to connect to database'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res){
	res.send('hello');
});

app.get('/movies', MovieController.getMovies);

app.post('/movies', MovieController.addMovie);

app.delete('/movies/:title', MovieController.deleteMovie);

app.listen(process.env.PORT || 8080);

module.exports = app;
