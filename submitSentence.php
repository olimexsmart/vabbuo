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
$marpione = filter_var(isset($_POST['sentence']) ? true : null, FILTER_SANITIZE_STRING);

// These come from the server, no need to sanitize
$remote = ip2long($_SERVER['REMOTE_ADDR']);
$remoteString = $_SERVER['REMOTE_ADDR'];


$query = "INSERT INTO newsentences VALUES(NULL, '$remote', '$remoteString', NULL, '$nickname', '$sentence', '$email', '$sex', '$contact', NULL)";

if (!$sql->query($query)) {
    echo "Could not insert into database: " . $sql->error;
}

$sql->close();

echo "Grazie, vorrei che non ti facesse cambiare pagina qui ma vabbuò";
