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
    });
});

// get response
$(function(){
    $.ajax({
        url: "utils/trends.php",
        dataType: "JSON",
        beforeSend: function(){
            $('.row').append('<img src="assets/img/loading.gif"/>');
        },
        success: function(trends) {
            var i = 0;
            $('.row img').addClass('small');
            trends[0]['trends'].forEach(function(curr){
                $.ajax({
                    method : "POST",
                    url: "utils/getTweets.php",
                    data: {
                        url: curr['url']
                    },
                    dataType: "JSON",
                    success: function(tweet) {
                        $('.row .column:nth-child('+ (i%4 + 1) +')').append('<div></div>');
                        $('.row .column:nth-child('+ (i%4 + 1) +') div:last-child').append('<p><a href="'+ curr['url'] +'" target="_blank">'+ curr['name'] +'</a></p>');
                        $('.row .column:nth-child('+ (i%4 + 1) +') div:last-child').append(tweet['html']);
                        twttr.widgets.load($('.row'));
                        i++;
                    }
                });
            });
        }
    });
});