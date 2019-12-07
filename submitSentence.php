<?php
// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) {
    die($sql->connect_error);
}
// Solves accented chars handling
$sql->query('SET NAMES utf8');

// Getting seed from client sanitazing them
$nickname = filter_var(isset($_POST['nickname']) ? $_POST['nickname'] : null, FILTER_SANITIZE_STRING);
$sentence = filter_var(isset($_POST['sentence']) ? $_POST['sentence'] : null, FILTER_SANITIZE_STRING);
$email = filter_var(isset($_POST['email']) ? $_POST['email'] : null, FILTER_SANITIZE_STRING);
$sex = filter_var(isset($_POST['sex']) ? $_POST['sex'] : null, FILTER_SANITIZE_STRING);
$contact = filter_var(isset($_POST['marpione']) ? 1 : 0, FILTER_SANITIZE_STRING);
$other = filter_var(isset($_POST['other']) ? $_POST['other'] : null, FILTER_SANITIZE_STRING);

// These come from the server, no need to sanitize
$ip = $_SERVER['REMOTE_ADDR'];

// Include and instantiate the class.
require_once 'Mobile_Detect.php';
$detect = new Mobile_Detect;
$device = "";
// First load the page
if($detect->isMobile() && !$detect->isTablet()) {
    echo file_get_contents("mobileStart.html");
    $device = "mobile";
} else {
    echo file_get_contents("start.html");
    $device = "PC";
}
// Just check if tablet
if($detect->isTablet()) {
    $device = "tablet";
}

$geolocate = json_decode(file_get_contents('http://freegeoip.net/json/' . $ip), true);
$geolocation = preg_replace("/\'/", "\'",  $geolocate['country_name'] . ', ' . $geolocate['region_name'] . ', ' . $geolocate['city']);

$query = "INSERT INTO newsentences VALUES(NULL, NULL, '$ip', '$device', '$geolocation', '$nickname', '$sentence', '$email', '$sex', '$contact', '$other')";

if (!$sql->query($query)) {
    echo "Could not insert into database: " . $sql->error;
}

$sql->close();

echo "OK";
