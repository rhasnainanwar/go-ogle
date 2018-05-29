// misc
$(function(){
    $('body').attr('id', 'top');
});

// twitter
$(function(){
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "assets/js/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };
        return t;
    }(document, "script", "twitter-wjs"));
});
// scroll
$(function() {
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 10) {
            $('.menu-line').css({
                "background-color": "rgb(35,39,49)",
            });
            $('.menu-line .container').css({
                "border-bottom": "none",
            });

        } else {
            $('.menu-line').css({
                "background-color": "rgba(35,39,49,0)",
            });
            $('.menu-line .container').css({
                "border-bottom": "1px solid rgba(255, 255, 255, 0.2)",
            });
        }
        // scroll to top
        if(scroll >= 100) $('.top-scroll').show(500);
        else $('.top-scroll').hide(500);
    });
});

// modal
$(function(){
    $('#confirm').show();
    $('#media').on('click', function(){
        $('#confirm').hide(700);
        request();
    });
    $('.close').click(function(){
        $('#confirm').hide();
        request();
    });
});

// get response
function request(){
    id = $('.row').parents('#trending') ? 1 : 2211387;
    $.ajax({
        method: "POST",
        url: "utils/trends.php",
        dataType: "JSON",
        data: {
            id: id
        },
        beforeSend: function(){
            $('.row').append('<img src="assets/img/loading.gif"/>');
        },
        success: function(trends) {
            var i = 0;
            $('.row img').addClass('small');
            trends.forEach(function(curr){
                $.ajax({
                    method : "POST",
                    url: "utils/getTweets.php",
                    data: {
                        url: curr['url'],
                        media: !$('#media').prop('checked')
                    },
                    dataType: "JSON",
                    success: function(tweet) {
                        $('.row .column:nth-child('+ (i%4 + 1) +')').append('<div></div>');
                        $('.row .column:nth-child('+ (i%4 + 1) +') div:last-child').append('<p><a href="'+ curr['url'] +'" target="_blank">'+ curr['name'] +'</a></p>');
                        $('.row .column:nth-child('+ (i%4 + 1) +') div:last-child').append(tweet["html"]);
                        twttr.widgets.load($('.row'));
                        i++;
                    }
                });
            });
        },
        complete: async function () {
            await new Promise(resolve => {
                setTimeout(() => {
                  resolve(this);
                }, 45000);
              });
            $('.row img').remove();
        }
    });

};

// maps
var map, infoWindow, service;
function initMap(){
    var lums = {lat: 31.4699827, lng: 74.4088985}
    var prop = {
        center: lums,
        zoom: 16
    }
    map = new google.maps.Map(document.getElementById('map'), prop);
    infoWindow = new google.maps.InfoWindow;
    service = new google.maps.places.PlacesService(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}