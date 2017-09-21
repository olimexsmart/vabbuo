<?php
// Include and instantiate the class.
require_once 'Mobile_Detect.php';
$detect = new Mobile_Detect;

// First load the page
if ($detect->isMobile()) {
    echo file_get_contents("mobileStart.html");
} else {
    echo file_get_contents("start.html");
}



// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) {
    die($sql->connect_error);
}

// Getting information
$remote = ip2long($_SERVER['REMOTE_ADDR']);
$remoteString = $_SERVER['REMOTE_ADDR'];
$headers = apache_request_headers();
$userAgent = $headers['User-Agent'];

$geolocate = json_decode(file_get_contents('http://freegeoip.net/json/' . $remoteString), true);
$geolocation = $geolocate['country_name'] . ', ' . $geolocate['region_name'] . ', ' . $geolocate['city'];

$query = "INSERT INTO accessLog VALUES(NULL, '$remote', '$remoteString', '$geolocation', '$userAgent', NULL)";

if (!$sql->query($query)) {
    echo "Could not insert into database: " . $sql->error;
}

$sql->close();
