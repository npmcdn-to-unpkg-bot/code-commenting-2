var userEmail ='';

if (location.hash.indexOf('album') !== -1) {
  gotoHash();
} else {
  renderHome();
}

// localStorage.clear();

$(window).on('hashchange', gotoHash); // Hash change event

function gotoHash() {
  // console.log('GO TO HASH');
  var albumHash = location.hash.match(/album=.*?(?=&)/g);
  var imageHash = location.hash.match(/image=.*?(?=&)/g);
  if (imageHash !== null) {
    albumHash = albumHash[0];
    imageHash = imageHash[0];
    albumIndex = albumHash.split('=')[1];
    imageIndex = imageHash.split('=')[1];
    renderImage(albumIndex, imageIndex);
  } else if (albumHash !== null) {
    albumHash = albumHash[0];
    albumIndex = albumHash.split('=')[1];
    renderAlbum(albumIndex);
  }
}


function renderHome() {
  var $modalContainer = $('.modal-container');
  var $loginBtn = $('#email-submit');
  var $emailInput = $('#email-input');

  var $logoutBtn = $('.logoutBtn');
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');

  $myAlbums.css('display', 'block'); // Removes the page before it.
  $imagePage.css('display', 'none'); // Removes the page after it.
  $albumPage.css('display', 'none'); // Display this page

  var $albumsGrid = $('.albums-grid');
  $albumsGrid.empty();

  if (!sessionStorage.email) {
    $modalContainer.css('display', 'flex');
    $('.login').css('display', 'flex');
  }

  $emailInput.on('keyup', function(e){
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test($emailInput.val())) {
      $loginBtn.addClass('valid');
    } else {
      $loginBtn.removeClass('valid');
    }
  });


  $loginBtn.on('click', function(){
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test($emailInput.val())) {
      // VALID EMAIL
      userEmail = $emailInput.val();
      sessionStorage.email = $emailInput.val();
      $modalContainer.css('display', 'none');
      $('.modal').css('display', 'none');
    } else {
      // INVALID EMAIL
      $('.login.modal').effect( "shake" );
    }
  });

  $logoutBtn.on('click', function(){
    userEmail = '';
    if (sessionStorage.email) {
      sessionStorage.removeItem('email');
    }
    $modalContainer.css('display', 'flex');
    $('.login').css('display', 'flex');
  });

  var allAlbumNames = [];
  data.forEach(function(album) {
    allAlbumNames.push(album.title);
  });

  if(window.localStorage && localStorage.albums) { // If the user has albums saved.
    var albumsArray = localStorage.getItem('albums');
    albumsArray = JSON.parse(albumsArray);
    albumsArray.forEach(function(album) {
      if (allAlbumNames.indexOf(album.title) === -1) {
        data.push(album);
      }
    });
  }

  data.forEach(function(album, i) {
    var liHTML = '<li class="album"><a href="#"><div class="album-meta"><div><i class="fa fa-heart" aria-hidden="true"></i><i class="fa fa-heart-o" aria-hidden="true"></i><p class="likes">0</p></div><h5 class="Album title">Album Title</h5></div><div class="image-container"></div></a></li>';
    var $li = $(liHTML);
    // Set the BG image
    $li.children('a').children('.image-container').css('background-image', 'url(' + album.images[0] + ')');
    // Set the title
    $li.children('a').children('.album-meta').children('h5').text(album.title);
    $li.children('a').children('.album-meta').children('div').children('p').text(album.likes);
    // Set the data:
    $li.children('a').children('.image-container').attr('data-index', i);
    // console.log($li.data()); // To call the data.

    $albumsGrid.append($li);

    // event Listener
    $li.children('a').children('.image-container').on('click', function(e){
      // renderAlbum($(this).data().index);
      location.hash = 'album=' + $(this).data().index + '&';
      return false; // This prevents the anchor tag href to set the hash
    });

    $li.children('a').children('.album-meta').children('div').on('click', function(){
      // var $likedDiv = $li.children('a').children('.album-meta').children('div');
      var albumIndex = $(this).closest('.album-meta').siblings('.image-container').data().index;
      if ($(this).hasClass('liked')) {
        $(this).removeClass('liked');
        data[albumIndex].likes--;
      } else {
        $(this).addClass('liked');
        data[albumIndex].likes++;
      }
      $(this).children('p').text(data[albumIndex].likes);
    });
  });


  var newAlbumHTML = '<li class="new-album"><div><i class="fa fa-plus" aria-hidden="true"></i><h3>New Album</h3></div></li>';
  $albumsGrid.append($(newAlbumHTML));

  var $newAlbum = $('.new-album');









  $newAlbum.on('click',function(){
    $modalContainer.css('display', 'flex');
    $('.create-album').css('display', 'flex');
    var $submitBtn = $('#album-submit');

    var $albumName = $('.album-name');
    var $imageInput = $('#album-first-image');

    $submitBtn.on('click', function(){
      if ($albumName.val() !== '' && $imageInput.val() !== '') {
        var imageURL = $imageInput.val();
        var albumName = $albumName.val();

        if(window.localStorage) {
          if (localStorage.albums) { // If albums have been stored
            var albumsArray = localStorage.getItem('albums');
            albumsArray = JSON.parse(albumsArray);
            var albumAlreadyExists = false;
            albumsArray.forEach(function(album){
              if (album.title === albumName) { albumAlreadyExists = true; }
            });
            if (!albumAlreadyExists) {
              var newAlbumObject = {
                title: albumName,
                likes: 0,
                images: [imageURL]
              };
              albumsArray.push(newAlbumObject);
              localStorage.setItem('albums', JSON.stringify(albumsArray));
              // Render home with the new album
              renderHome();
            } else {
              throw new Error('This album already exists');
            }
          } else {
            var albumObject = {
              title: albumName,
              images: [imageURL]
            };
            var albums = [albumObject];
            localStorage.setItem('albums', JSON.stringify(albums));
          }
        }
        $modalContainer.css('display', 'none');
        $('.modal').css('display', 'none');
      }
    });





    $('.dismiss').one('click', function(){
      $modalContainer.css('display', 'none');
      $('.modal').css('display', 'none');
    });

    $modalContainer.one('click', function(e){
      if ($(e.target).hasClass('modal-container')) {
        $modalContainer.css('display', 'none');
        $('.modal').css('display', 'none');
      }
    });
  });
}










function renderAlbum(albumIndex) { // albumIndex is a data object with index as a key
  var $modalContainer = $('.modal-container');
  var albumName = data[albumIndex].title;
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  var $addImageModal = $('.add-image');
  $myAlbums.css('display', 'none'); // Removes the page before it.
  $imagePage.css('display', 'none'); // Removes the page after it.
  $albumPage.css('display', 'flex'); // Display this page

  $modalContainer.on('click', function(e){
    if ($(e.target).hasClass('modal-container')) {
      $modalContainer.css('display', 'none');
    }
  });

  $('.dismiss').on('click', function() {
    $modalContainer.css('display', 'none');
    $('.modal').css('display', 'none');
  });

  var $sideUl = $('.side-bar div').children('ul');
  $('.album-title').text(data[albumIndex].title); // Set the title
  $('.side-bar a').on('click', function() {
    renderHome();
  });

  var $grid = $('.grid').masonry({
    // options
    itemSelector: '.grid-item',
    columnWidth: ($('.grid').width()/4)-10 // I need this to be the same as calc(100%/4)
  });

  var gridItems = $grid.masonry('getItemElements');

  gridItems.forEach(function(item){
    $grid.masonry( 'remove', item );
  });

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

  if(window.localStorage && localStorage.albums) { // If the browser supports localstorage
    var albumsArray = localStorage.getItem('albums'); // Get the album object
    albumsArray = JSON.parse(albumsArray); // Parse it with JSON
    var localAlbumIndex = 0;
    var savedAlbumExists = false;
    albumsArray.forEach(function(album, i){
      if (album.title === albumName) {
        localAlbumIndex = i;
        savedAlbumExists = true;
      }
    });
    if (savedAlbumExists) {
      albumsArray[localAlbumIndex].images.forEach(function(imgURL, i) { // Loop through the images array inside it
        if (data[albumIndex].images.indexOf(imgURL) === -1) { // If our data doesn't already have the image
          data[albumIndex].images.push(imgURL); // Add the image to the existing data object.
        }
      });
    }
  }

  $('.album-link:nth-child(' + (albumIndex+1) + ')').addClass('selected'); // Select our current album


  data[albumIndex].images.forEach(function(image, i){
    appendImage(image, i);
  });

  function appendImage(image, i) {
    var imageHTML = '<div class="grid-item"><img src="' + image + '" alt="" <img/></div>';
    var $image = $(imageHTML);
    $image.attr('data-index', i);
    $image.css('width', ($('.grid').width()/4)-10 + 'px');
    $grid.masonry().append($image).masonry( 'appended', $image ).masonry();

    $image.unbind('click');
    $image.on('click', function(e){
      location.hash = 'album=' + albumIndex + '&image=' + $(this).data().index + '&';
    });
  }

  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout'); // Layout images after they have been loaded
  });

  $('.add-image-button').on('click', function(){
    $modalContainer.css('display', 'flex');
    $addImageModal.css('display', 'flex');
  });

  $(".submit").unbind('click');
  $('.submit').on('click', function(){
    console.log('CLICKED SUBMIT');
    var imgURL = $('.image-url').val();
    var albumObject = {
      title: albumName,
      likes: 0,
      images: [imgURL]
    };
    console.log(albumObject);

    if(window.localStorage && localStorage.albums) {
        console.log('Album already exists');
        var albumsArray = localStorage.getItem('albums');
        albumsArray = JSON.parse(albumsArray);
        var savedAlbumExists = false;
        var savedAlbumIndex = 0;

        albumsArray.forEach(function(album, i){
          if (album.title === albumName) {
            savedAlbumExists = true;
            savedAlbumIndex = i;
          }
        });
        if (savedAlbumExists) {
          albumsArray[savedAlbumIndex].images.push(imgURL);
          localStorage.setItem('albums', JSON.stringify(albumsArray));
        } else {
          albumsArray.push(albumObject);
          localStorage.setItem('albums', JSON.stringify(albumsArray));
        }

      } else {
        console.log('Creating new Album file');
        var albums = [albumObject];
        localStorage.setItem('albums', JSON.stringify(albums));
      }
    $modalContainer.css('display', 'none');
    $('.modal').css('display', 'none');
    appendImage(imgURL, data[albumIndex].images.length-1);
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout'); // Layout images after they have been loaded
    });
  });
}


















function renderImage(albumIndex, imageIndex) {
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  $myAlbums.css('display', 'none'); // Removes page
  $albumPage.css('display', 'none'); // Remove page
  $imagePage.css('display', 'flex'); // Display page

  var $slider = $('.slider');
  $slider.empty();
  var autoplay = false;

  var prevImageIndex = imageIndex-1;
  var nextImageIndex = imageIndex+1;

  if (imageIndex === 0) { // If first image:
    prevImageIndex = data[albumIndex].images.length-1;
  } else if (imageIndex === data[albumIndex].images.length-1) { // If last image
    nextImageIndex = 0;
  }

  var currentIndex = imageIndex;
  // Add previous image
  var prevImageHTML = '<li><img src="' + data[albumIndex].images[prevImageIndex] + '" alt="" /></li>';
  $prevImage = $(prevImageHTML);
  $prevImage.addClass('single_slide');
  $prevImage.addClass('prev');
  $prevImage.attr('data-index', prevImageIndex);
  $slider.append($prevImage);
  // Add current image
  var currImageHTML = '<li><img src="' + data[albumIndex].images[imageIndex] + '" alt="" /></li>';
  $currImage = $(currImageHTML);
  $currImage.addClass('single_slide');
  $currImage.addClass('curr');
  $currImage.attr('data-index', imageIndex);
  $slider.append($currImage);

  // Add all other images
  data[albumIndex].images.forEach(function(image, i){
    if (i !== imageIndex && i !== prevImageIndex) {
      var imageHTML = '<li><img src="' + data[albumIndex].images[i] + '" alt="" /></li>';
      $image = $(imageHTML);
      $image.addClass('single_slide');
      if (i === imageIndex+1) {
        $image.addClass('next');
      }
      $image.attr('data-index', i);
      $slider.append($image);
    }
  });

  $('#backToAlbum').on('click', function(){
    renderAlbum(albumIndex);
  });

  $('.next').one('click', nextClickHandler);
  $('.prev').one('click', prevClickHandler);


  function nextClickHandler() {
    var $prev = $('.single_slide[data-index="' + (currentIndex-1) + '"]');
    var $curr = $('.single_slide[data-index="' + currentIndex + '"]');
    var $next = $('.single_slide[data-index="' + (currentIndex+1) + '"]');
    var $newNext = $('.single_slide[data-index="' + (currentIndex+2) + '"]');

    // Removes all event handlers from other images.
    $slider.children().off();

    if (currentIndex === -1) {
      console.log('JUST BEFORE CURR === 0');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').removeClass('curr').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-2) + '"]').removeClass('prev');
    } else if (currentIndex === 0) {
      $('.single_slide[data-index="' + '0' + '"]').removeClass('curr').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').removeClass('prev');
    } else {
      $prev.removeClass('prev');
      $curr.removeClass('curr');
      $curr.addClass('prev');
      $curr.one('click', prevClickHandler);
    }

    $next.removeClass('next').addClass('curr');

    if (currentIndex+1 === data[albumIndex].images.length-1) {
      $newNext = $('.single_slide[data-index="' + '0' + '"]');
      currentIndex = -1;
    } else {
      currentIndex++;
    }

    $newNext.addClass('next').one('click', nextClickHandler);
  }

  function prevClickHandler() {
    if (currentIndex === -1) {
      currentIndex = 0;
    }
    var $newPrev = $('.single_slide[data-index="' + (currentIndex-2) + '"]');
    var $prev = $('.single_slide[data-index="' + (currentIndex-1) + '"]');
    var $curr = $('.single_slide[data-index="' + currentIndex + '"]');
    var $next = $('.single_slide[data-index="' + (currentIndex+1) + '"]');

    // Removes all event handlers from other images.
    $slider.children().off();
    $slider.children().removeClass('prev');
    $slider.children().removeClass('next');
    $slider.children().removeClass('curr');

    if (currentIndex === 6) {
      $('.single_slide[data-index="' + '0' + '"]').removeClass('curr').addClass('next').one('click', nextClickHandler);
      $('.single_slide[data-index="' + '1' + '"]').removeClass('next');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').addClass('curr').removeClass('prev');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-2) + '"]').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-3) + '"]').removeClass('prev');
    } else {
      $prev.removeClass('prev').addClass('curr');
      $curr.removeClass('curr').addClass('next').one('click', nextClickHandler);
      $next.removeClass('next');
    }

    if (currentIndex-1 ===  0) { // If the next image is 0
      $newPrev = $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]');
      currentIndex = data[albumIndex].images.length-1;
    } else {
      currentIndex--;
    }
    $newPrev.addClass('prev').one('click', prevClickHandler);
  }

  if (autoplay === true) {
    setInterval(function() {
      nextClickHandler();
    }, 2000);
  }
}
