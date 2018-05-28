<?
require_once('TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => "",
    'oauth_access_token_secret' => "",
    'consumer_key' => "",
    'consumer_secret' => ""
);
// twitter object
$twitter = new TwitterAPIExchange($settings);
$requestMethod = "GET"; // as we are only retrieving data
?>