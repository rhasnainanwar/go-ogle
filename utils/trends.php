<?php
require_once('twitterInit.php');
require_once('simple_html_dom.php');

$lookup = "http://woeid.rosselliot.co.nz/lookup/";
$query = split(",", $_POST['loc'])[0];
$query = str_replace(" ", "%20", $query);

// search woeid
$html = file_get_html($lookup.$query);
$woeid = $html->find('td.woeid', 0)->plaintext;

// search tweets
$url = "https://api.twitter.com/1.1/trends/place.json";
$getfield = '?id='.$woeid;

// init request
$trending =  $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

$trends = json_decode($trending, TRUE)[0]['trends'];
echo json_encode($trends);
?>