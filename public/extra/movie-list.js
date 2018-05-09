$(document).ready(function(){

  $('.add-movie').on('submit', function(){

      var movieItem = $('.add-movie input');
      var movie = {movieItem: movieItem.val()};

      $.ajax({
        type: 'POST',
        url: '/pages/dashboard',
        data: movie,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
      return false;
  });

  $('.delete-item').on('click', function(){
      var movieItem = $(this).text().replace(/ /g, "-");
      $.ajax({
        type: 'DELETE',
        url: '/pages/dashboard' + movieItem,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});
