<?php

require_once('twitterInit.php');
require_once('simple_html_dom.php');

// f=tweets: latest tweets
$html = file_get_html($_POST['url']); //get the search page

// get link of latest tweet from each keyword
$link = $html->find('a.tweet-timestamp', 0);
$url = $link->attr['href'];

// api request e
$source = "https://publish.twitter.com/oembed";
$field = '?url=https://twitter.com'.$url;
$filters = '&omit_script=true&hide_media='.$_POST["media"];

// init request
$tweet =  $twitter->setGetfield($field.$filters)
->buildOauth($source, $requestMethod)
->performRequest();
echo $tweet;
?>