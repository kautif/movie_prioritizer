const movieList = [];

$('#search-field').on('submit', function(e){
	e.preventDefault();
});

// Make lines 9 to 29 a function. 
// Call function inside handleSearch. 
// Give function data argument in order to access API data

function updateMovie(){
	$(document).on('submit', '.add-movie', function(e){
		e.preventDefault();
		let movieID = parseInt($(this).attr('id'));
		console.log(movieID);
		const movieTitle = this.children[0].innerText;
		const ratingScore = `${movieResults.results[movieID].vote_average * 10}`;
		const releaseDate = `${movieResults.results[movieID].release_date}`;
		let movieObj = {
			title: movieTitle,
			rating: ratingScore,
			release: releaseDate
		};

		console.log(movieObj);
		$.ajax({
			method: 'put',
			data: movieObj,
			url: '/profile/movies'
		});
	});
}

updateMovie();

let movieResults;

function movieSearch(){
	let queryStr = $('#search').val();
		$.get(
			'https://api.themoviedb.org/3/search/movie',
			{
				api_key: '08eba60ea81f9e9cf342c7fa3df07bb6',
				query: queryStr
			},
				function getRequest(data){
					movieResults = data;
					handleSearch(data);
					// removeBrokenImg(data);
				}
			)
};

function handleSearch(data){
		$('.movie-container').html('');
	
// List of results

	for (let i = 0; i < data.results.length; i++) {
		let resultName = data.results[i].title;
		if (data.results[i].title.length > 15) {
				resultName = data.results[i].title.substring(0, 15) + '...';
		}
		
		let imgPath = `https://image.tmdb.org/t/p/w200_and_h300_bestv2${data.results[i].poster_path}`;
		let imgUnavailable = `https://lh6.googleusercontent.com/5vaCOketHTH0FcofsR8-W1XQ3r85fl5mj_lp4ghKgunKnAHBob0yqSKhNwD2wGPMwyy959RKe_cqCkpFySk_=w1366-h613`;
		let finalImgPath;

		if (imgPath === `https://image.tmdb.org/t/p/w200_and_h300_bestv2null`) {
			finalImgPath = imgUnavailable;
		} else {
			finalImgPath = imgPath;
		}

		$('.movie-container')
		.append(`<form method="post" class="add-movie" id="${i}"> 
			<p class="movie-results">${resultName}</p> 
			<img src="${finalImgPath}"> 
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