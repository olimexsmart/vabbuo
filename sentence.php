<?php

// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) { die($sql->connect_error); }
$sql->query('SET NAMES utf8');

// Getting seed from client
$seed = isset($_POST['seed']) ? $_POST['seed'] : null;

// Getting how many sentences we have, id must be contiguos
$count = "SELECT COUNT(1) FROM sentences";
if (!$result = $sql->query($count)) { die("Error retreiving row count."); }
// Generating id key from seed
$nSentences = $result->fetch_row()[0];
$key = ($seed % $nSentences) + 1;

$select = "SELECT text from sentences where id = $key";
if (!$result = $sql->query($select)) { die("Error retreiving row sentence."); }

// Remember there is no multiline support
echo $result->fetch_row()[0];