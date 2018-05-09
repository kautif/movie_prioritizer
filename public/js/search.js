$('#search-field').on('submit', function(e){
	e.preventDefault();
});

$(document).on('submit', '.add-movie', function(e){
	e.preventDefault();
	const movieTitle = this.children[0].innerText

	$.ajax({
		url: '/movies',
		type: 'post',
		data: {
			title: movieTitle
		},
		success: function(movie){
			console.log(movie);
		}
	})

	$('#moviesInfo tbody').append(`
		<tr>
			<td>${movieTitle}</td>
			<td>dummy text</td>
			<td>dummy text</td>
			<td>dummy text</td>
			<td>dummy text</td>
			<td>dummy text</td>
		</tr>
	`)
});



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
				}
			)
};

function handleSearch(data){
		$('.movie-container').html('');
	for (let i = 0; i < data.results.length; i++) {
		$('.movie-container')
		.append(`<form method="post" action="/pages/dashboard" class="add-movie">
			<p class="movie-results" name="movie[name]">${data.results[i].title}</p>
			<button type="submit">Add to List</button>
			</form>`);
	}
}

// module.exports = search;