<?php
// Include and instantiate the class.
require_once 'Mobile_Detect.php';
$detect = new Mobile_Detect;
$device = "";
// First load the page
if($detect->isMobile() && !$detect->isTablet()){
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

// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) {
    die($sql->connect_error);
}

// Getting information
$ip = $_SERVER['REMOTE_ADDR'];
$headers = apache_request_headers();
$userAgent = preg_replace("/\'/", "\'", $headers['User-Agent']);

$geolocate = json_decode(file_get_contents('http://freegeoip.net/json/' . $ip), true);
$geolocation = preg_replace("/\'/", "\'",  $geolocate['country_name'] . ', ' . $geolocate['region_name'] . ', ' . $geolocate['city']);

$query = "INSERT INTO accessLog VALUES(NULL, NULL, '$ip', '$device', '$geolocation', '$userAgent')";

if (!$sql->query($query)) {
    echo "Could not insert into database: " . $sql->error;
}

$sql->close();
