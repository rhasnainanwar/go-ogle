<?php
require_once('twitterInit.php');

$url = "https://api.twitter.com/1.1/geo/search.json";
$getfield = '?lat='.$_POST['lat'].'&long='.$_POST['lng'];
$constraints = '&max_results=10';

// init request
$places =  $twitter->setGetfield($getfield.$constraints)
    ->buildOauth($url, $requestMethod)
    ->performRequest();

$places = json_decode($places, TRUE);
$locs = array();

for ($i=0; $i < count($places['result']['places']); $i++) { 
	$coordinates = $places['result']['places'][$i]['bounding_box']['coordinates'];

	array_push($locs, array("lat" => $coordinates[0][0][1], "lng" => $coordinates[0][0][0]));
}
echo json_encode($locs);
?>