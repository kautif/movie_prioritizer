const movieList = [];

$('#search-field').on('submit', function(e){
	e.preventDefault();
});

// Make lines 9 to 29 a function. 
// Call function inside handleSearch. 
// Give function data argument in order to access API data


let movieResults;

function movieSearch(){
	let queryStr = $('#search').val();
		$.when($.get('https://api.themoviedb.org/3/search/movie',
			{
				api_key: '08eba60ea81f9e9cf342c7fa3df07bb6',
				query: queryStr
			}), $.get('/profile/mylist/json'))
				.done(function(searchResults, savedResults){
					// console.log('search results: ', searchResults, 'saved results: ', savedResults[0][0].tmdbID);
						let savedIds = [];
						tmdbID = 0;
					for (let i = 0; i < savedResults[0].length; i++) {
						savedIds.push(savedResults[0][i].tmdbID);
					}

						movieResults = searchResults[0]; 
						console.log('Line 58: ', movieResults);
					console.log('SavedIds: ', savedIds);
					handleSearch(searchResults[0], savedIds);
				});

		// $.get(
		// 	'https://api.themoviedb.org/3/search/movie',
		// 	{
		// 		api_key: '08eba60ea81f9e9cf342c7fa3df07bb6',
		// 		query: queryStr
		// 	},
		// 		function getRequest(data){
		// 			movieResults = data;
		// 			handleSearch(data);
		// 			// removeBrokenImg(data);
		// 		}
		// 	)
};

function updateMovie(){
	$(document).on('submit', '.add-movie', function(e){
		e.preventDefault();
		let movieID = parseInt($(this).attr('id'));
		// console.log('Line 51', movieResults.results);
		const movieTitle = this.children[0].innerText;
		const ratingScore = movieResults.results[movieID].vote_average * 10;
		const releaseDate = movieResults.results[movieID].release_date;
		const uniqueID = movieResults.results[movieID].id;


		let movieObj = {
			title: movieTitle,
			rating: ratingScore,
			release: releaseDate,
			tmdbID: uniqueID 
		};
		// console.log(movieObj);

		$.ajax({
			method: 'put',
			data: movieObj,
			url: '/profile/movies',
			success: function(result){
				let queryStr = $('#search').val();
				// location.reload();
				$.get('https://api.themoviedb.org/3/search/movie',
			{
				api_key: '08eba60ea81f9e9cf342c7fa3df07bb6',
				query: queryStr
			})
				.then((movies)=> {
					movieSearch();
				})
				console.log(queryStr);
			}
		});
	});
}

updateMovie();

function handleSearch(data, savedMovieIds){
		$('.movie-container').html('');
	$.getJSON('/profile/mylist/json', console.log);
// List of results
	// console.log(data.results);
	for (let i = 0; i < data.results.length; i++) {
		let resultName = data.results[i].title;
		if (data.results[i].title.length > 15) {
				resultName = data.results[i].title.substring(0, 12) + '...';
		}
		
		let imgPath = `https://image.tmdb.org/t/p/w200_and_h300_bestv2${data.results[i].poster_path}`;
		let imgUnavailable = `../img/img-unavailable.png`;
		let finalImgPath;

		if (imgPath === `https://image.tmdb.org/t/p/w200_and_h300_bestv2null`) {
			finalImgPath = imgUnavailable;
		} else {
			finalImgPath = imgPath;
		}

		$('.movie-container')
		.append(`<form method="post" class="add-movie" id="${i}"> 
			<p class="movie-results">${resultName}</p> 
			<img movie-id="${i}" src="${finalImgPath}"> 
			${savedMovieIds.includes(data.results[i].id) ? '<button disabled>Saved</button>' : '<button type="submit">Add to List</button>'} 
			</form>`);
	}

	// Lightbox

		$('.add-movie img').click(function () {
			let movieID = parseInt($(this).attr('movie-id'));
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

$('.delete').click(function(e){
	e.preventDefault();
	let item = $(this).attr('data-id');
	$.ajax({
		method: 'DELETE',
		url: '/profile/mylist/' + item,
		success: function(data){
			location.reload(data);
			// console.log(data);
		}
	});
});
// module.exports = {movieList}; 

// Compare tmdbID in JSON of movies array to id in movie search. 
// If equal, grey out button and make unclickable. If not equal, button should still be enabled. 