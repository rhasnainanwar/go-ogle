<?php
require_once('twitterInit.php');
$url = "https://api.twitter.com/1.1/trends/place.json";
$getfield = '?id=1';

// init request
$trending =  $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();
echo $trending;
?>