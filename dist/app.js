var userName ='';

// renderHome(userName);
renderAlbum(1);
// renderImage();


function renderHome(userID) {
  var $albumsGrid = $('.albums-grid');
  data.forEach(function(album, i) {
    var liHTML = '<li class="album"><a href="#"><div class="image-container"></div><div class="album-footer"><h5 class="Album title">Album Title</h5><p class="user">username</p></div></a></li>';
    var $li = $(liHTML);
    // Set the BG image
    $li.children('a').children('.image-container').css('background-image', 'url(assets/images/' + album.title + '/' + album.images[0] + '.jpg)');
    // Set the title
    $li.children('a').children('.album-footer').children('h5').text(album.title);
    // Set the user
    $li.children('a').children('.album-footer').children('p').text(album.user);
    // Set the data:
    $li.attr('data-index', i);
    // console.log($li.data()); // To call the data.

    $albumsGrid.append($li);

    // event Listener
    $li.on('click', function(e){
      renderAlbum($(this).data());
    });
  });
}









function renderAlbum(albumIndex) { // albumIndex is an object with index as a key
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  $myAlbums.css('display', 'none'); // Removes the page before it.
  $imagePage.css('display', 'none'); // Removes the page after it.
  $albumPage.css('display', 'flex'); // Display this page

  var $sideUl = $('.side-bar').children('ul');

  var $grid = $('.grid').masonry({
    // options
    itemSelector: '.grid-item',
    columnWidth: 200
  });

  var gridItems = $grid.masonry('getItemElements');

  gridItems.forEach(function(item){
    $grid.masonry( 'remove', item );
  });

  // $grid.empty();
  $sideUl.empty();


  data.forEach(function(album, i){
    var sideLiHTML = '<li class="album-link"><a href="#">' + album.title + '</a></li>';
    var $sideLi = $(sideLiHTML);
    $sideLi.attr('data-index', i);

    $sideUl.append($sideLi);

    $sideLi.on('click', function(e){
      renderAlbum($(this).data().index);
    });
  });

  data[albumIndex].images.forEach(function(image, i){
    var imageHTML = '<div class="grid-item"><img src="' + image + '" alt="" <img/></div>';
    var $image = $(imageHTML);
    $image.attr('data-index', i);
    $grid.masonry().append($image).masonry( 'appended', $image ).masonry();

    $image.on('click', function(e){
      renderImage(albumIndex, $(this).data().index);
    });
  });
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout'); // Layout images after they have been loaded
  });
}










function renderImage(albumIndex, imageIndex) {
  console.log(albumIndex);
  console.log(imageIndex);
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  $myAlbums.css('display', 'none'); // Removes page
  $albumPage.css('display', 'none'); // Remove page
  $imagePage.css('display', 'flex'); // Display page

  var $currImg = $('.currImg');
  var $prevImg = $('.prevImg');
  var $nextImg = $('.nextImg');

  // var $slider = $('.slider');
  var $slider = $('.slider');
  console.log();

  var prevImageIndex = imageIndex-1;
  var nextImageIndex = imageIndex+1;

  if (imageIndex === 0) { // If first image:
    prevImageIndex = data[albumIndex].images.length-1;
  } else if (imageIndex === data[albumIndex].images.length-1) { // If last image
    nextImageIndex = 0;
  }

  data[albumIndex].images.forEach(function(image, i){
    var imageHTML = '<li><img src="' + data[albumIndex].images[i] + '" alt="" /></li>';
    $image = $(imageHTML);
    if (i === prevImageIndex) {
      $image.addClass('prevImg');
    } else if (i === imageIndex) {
      $image.addClass('currImg');
    } else if (i === nextImageIndex) {
      $image.addClass('nextImg');
    } else {
      // $image.addClass('hiddenImage');
    }

    $slider.append($image);
  });

	$slider.each(function() {
    var slider = $(this);
    var autoplay = slider.data('autoplay');
		var items = slider.data('items');
		var easing = slider.data('easing');
		var duration = slider.data('duration');
		var single_slide = slider.find('.single_slide');
		// var slider_height = single_slide.css('height', slider.data('height'));
		var offset = ($(window).width()-1260)/2-1260;

    $.each(single_slide, function(index) {
			if (index === 0) $(this).addClass('img' + single_slide.length);
			else $(this).addClass('img' + index);
		});

    slider.css({'width': single_slide.length*1260, 'left': offset});
		single_slide
		.eq(0).addClass('prev').end()
		.eq(1).addClass('active').end()
		.eq(2).addClass('next');

    function moveLeft() {
			$('.active').removeClass('active').prev().addClass('active');

			slider.animate({
				left: slider.position().left+single_slide.outerWidth(true),
				easing: easing,
				step: items
			}, duration, function() {
				$('.single_slide:last').detach().prependTo(slider);
				slider.css('left', offset);
				newNav();
			});
		}

    function moveRight() {
			$('.active').removeClass('active').next().addClass('active');

			slider.animate({
				left: slider.position().left-single_slide.outerWidth(true),
				easing: easing,
				step: items
			}, duration, function() {
				$('.single_slide:first').detach().appendTo(slider);
				slider.css('left', offset);
				newNav();
			});
		}

    function newNav() {

			$('.prev').removeClass('prev');
			$('.next').removeClass('next');
			$('.single_slide')
			.eq(0).addClass('prev').end()
			.eq(2).addClass('next');
		}

    $(document).on('click', '.prev', function() {
			moveLeft();
		});

		$(document).on('click', '.next', function() {
			moveRight();
		});

		if (autoplay == 1) {
			setInterval(function() {
				moveRight();
			}, duration);
		}

  });

  // var $prevImage = $('.prevImg');
  // var $currImage = $('.currImg');
  // console.log('WIDTH:', $prevImage.width());
  //
  // $prevImg.html('<img src="' + data[albumIndex].images[prevImageIndex] + '" alt="" />');
  // $currImg.html('<img src="' + data[albumIndex].images[imageIndex] + '" alt="" />');
  // $nextImg.html('<img src="' + data[albumIndex].images[nextImageIndex] + '" alt="" />');
}









//
