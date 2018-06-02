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
        if(scroll >= 200) $('.top-scroll').show(500);
        else $('.top-scroll').hide(500);
    });
});

// modal
$(function(){
    $('#confirm').show();
    $('#media').on('click', function(){
        $('#confirm').hide(700);
        if($('#trending').length > 0)
            request('earth');
    });
    $('.close').click(function(){
        $('#confirm').hide();
        if($('#trending').length > 0)
            request('earth');
    });
});

var xhrReq;
// get response
function request(place){
    if(xhrReq && xhrReq.readyState != 4){
        xhrReq.abort();
        $('.row .column').empty();
        $('.row img').remove();
        console.log('Aborting');
    }
    xhrReq = $.ajax({
        method: "POST",
        url: "utils/trends.php",
        dataType: "JSON",
        data: {
            loc: place
        },
        beforeSend: function(){
            console.log('requesting for ' + place);
            $('.row .column').empty();
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

            if( i == trends.length) $('.row img').remove();
        }
    });
};

/* GOOGLE MAP */

// global variables
var map, service, geocoder;
var markers = [];

// initialize map
function initMap(){
    var isb = {lat: 33.6940144, lng: 73.0629307}
    var prop = {
        center: isb,
        zoom: 10
    }
    map = new google.maps.Map(document.getElementById('map'), prop);
    service = new google.maps.places.PlacesService(map);
    geocoder = new google.maps.Geocoder;

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(pos);
      });
    }
    getNear(map.getCenter().lat(), map.getCenter().lng());

    map.addListener('click', function(e){
        map.setZoom(10.5);
        map.setCenter(e.latLng);
        getNear(map.getCenter().lat(), map.getCenter().lng());
    });

    map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
        return;
        }

        // Clear out the old markers.
        clearMarkers();

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            getNear(place.geometry.location.lat(), place.geometry.location.lng());
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

var xhrNear;

/* MAP RELATED UTILITY FUNCTIONS */
function getNear(lt, lg) {
    if(xhrNear && xhrNear.readyState != 4){
        xhrNear.abort();
    }
    geocoder.geocode({'location': {lat: lt, lng: lg}}, function(results, status){
        if(status === 'OK'){
            var place = results[ parseInt(results.length / 2)].formatted_address;
            $('#loc').text('Showing results for ' + place);
            request(place);
        }
    });

    xhrNear = $.ajax({
        method: "POST",
        url: "utils/nearby.php",
        data: {
            lat: lt,
            lng: lg
        },
        dataType: "JSON",
        success: function(locs){
            drop(locs);
        }
    });
}

function drop(neighborhoods) {
    clearMarkers();
    markers.push(new google.maps.Marker({
        position: {lat: map.getCenter().lat(),  lng: map.getCenter().lng()},
        map: map,
        icon: {path: google.maps.SymbolPath.CIRCLE, scale: 5}
    }));

    for (var i = 0; i < neighborhoods.length; i++) {
      addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
    attachEvent();
}

function addMarkerWithTimeout(pos, timeout) {
    window.setTimeout(function() {
        var mark = new google.maps.Marker({
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP,
            title: 'Click to explore'
        });
        mark.addListener('click', function(){
            map.setCenter(mark.getPosition());
            getNear(mark.getPosition().lat(), mark.getPosition().lng());
        });
        markers.push(mark);
    }, timeout);
}

function attachEvent() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].addListener('click');
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
}