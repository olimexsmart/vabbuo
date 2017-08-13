<?php
// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) { die($sql->connect_error); }
// Solves accented chars handling
$sql->query('SET NAMES utf8');

// Getting seed from client
$nickname = isset($_POST['nickname']) ? $_POST['nickname'] : null;
$sentence = isset($_POST['sentence']) ? $_POST['sentence'] : null;
$remote = ip2long($_SERVER['REMOTE_ADDR']);
$remoteString = $_SERVER['REMOTE_ADDR'];


$query = "INSERT INTO newsentences VALUES(NULL, '$remote', '$remoteString', NULL, '$nickname', '$sentence', NULL, NULL, NULL)";

if(!$sql->query($query))
echo "Could not insert into database: " . $sql->error;

$sql->close(); 

echo "Grazie, vorrei che non ti facesse cambiare pagina qui ma vabbuò"
?>
