<?php
require_once('twitterInit.php');
$url = "https://api.twitter.com/1.1/trends/place.json";
$getfield = '?id='.$_POST['id'];

// init request
$trending =  $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();
$trends = json_decode($trending, TRUE)[0]['trends'];
echo json_encode($trends);
?>