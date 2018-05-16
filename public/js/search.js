const movieList = [];

$('#search-field').on('submit', function(e){
	e.preventDefault();
});

// Make lines 9 to 29 a function. 
// Call function inside handleSearch. 
// Give function data argument in order to access API data

function getMovieData(data){
	$(document).on('submit', '.add-movie', function(e){
		e.preventDefault();
		let movieID = parseInt($(this).attr('id'));
		console.log(movieID);
		const movieTitle = this.children[0].innerText;
		const ratingScore = `${data.results[movieID].vote_average * 10}%`;
		const releaseDate = `${data.results[movieID].release_date}`;
		const movieObj = {
			title: movieTitle,
			rating: ratingScore,
			release: releaseDate
		};
		movieList.push(movieObj);
		console.log(movieList);
		
		$.ajax({
			method: 'put',
			data: {movieList},
			url: '/profile/movies'
		});
	});
}

function movieSearch(){
	let queryStr = $('#search').val();
		$.get(
			'https://api.themoviedb.org/3/search/movie',
			{
				api_key: '08eba60ea81f9e9cf342c7fa3df07bb6',
				query: queryStr
			},
				function getRequest(data){
					handleSearch(data);
					getMovieData(data);
				}
			)
};

function handleSearch(data){
		$('.movie-container').html('');
	
// List of results

	for (let i = 0; i < data.results.length; i++) {
		$('.movie-container')
		.append(`<form method="post" action="/pages/dashboard" class="add-movie" id="${i}">
			<p class="movie-results">${data.results[i].title}</p>
			<img src="https://image.tmdb.org/t/p/w200_and_h300_bestv2${data.results[i].poster_path}">
			<button type="submit">Add to List</button>
			</form>`);
	}

	// Lightbox

		$('.add-movie').click(function () {
			let movieID = parseInt($(this).attr('id'));
			$('.movie-container').append(`
				<div class="movie-result">
				<span class="close">&times;</span>
					<h1>${data.results[movieID].title}</h1>
					<div class="ratings">
						<h2>Ratings</h2>
						<p>${data.results[movieID].vote_average * 10}%</p>
					</div>
					<div class="release">
						<h2>Release Date</h2>
						<p>${data.results[movieID].release_date}</p>
					</div>
				</div>`)
			$('.close').click(function(){
				$('.movie-result').remove();
			});
		});

}

// module.exports = {movieList};