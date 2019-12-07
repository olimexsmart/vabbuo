<?php

// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) {
    die($sql->connect_error);
}
// Solves accented chars handling
$sql->query('SET NAMES utf8');

// Getting seed from client
$seed = isset($_POST['seed']) ? $_POST['seed'] : null;
if ($seed == null) {
    die("NULL seed");
}
if (filter_var($seed, FILTER_VALIDATE_INT) === false) {
    die("Invalid seed integer");
}

// Getting how many sentences we have, id must be contiguos
$count = "SELECT COUNT(1) FROM sentences";
if (!$result = $sql->query($count)) {
    die("Error retreiving row count.");
}
// Generating id key from seed
$nSentences = $result->fetch_row()[0];
$key = ($seed % $nSentences) + 1;

$query = "SELECT text, author from sentences where id = $key";
if (!$result = $sql->query($query)) {
    die("Error retreiving row sentence.");
}

// Response depending we have an author or not
$fetched = $result->fetch_row();
if ($fetched[1] != null) {
    $response = array(
                    'sentence' => $fetched[0],
                    'author' => $fetched[1],
                );
} else {
    $response = array(
                    'sentence' => $fetched[0],
                );
}
echo json_encode($response); // Sending senstence to client

/*  STATISTICS */
//Getting a time stamp of current hour
$now = new DateTime();
$format = $now->format('Y-m-d H') . ":00:00";

// Insert only if key is not present, otherwise update
$query = "INSERT INTO vabbuo.statistics VALUES('$format', 1)
         ON DUPLICATE KEY UPDATE requests = requests + 1; ";
if (!$sql->query($query)) {
    die("Could not insert into database: " . $sql->error);
}

$sql->close();
