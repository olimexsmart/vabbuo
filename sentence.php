<?php

// Database connection
require_once 'login.php';
$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
if ($sql->connect_error) { die($sql->connect_error); }
// Solves accented chars handling
$sql->query('SET NAMES utf8');

// Getting seed from client
$seed = isset($_POST['seed']) ? $_POST['seed'] : null;
if($seed == null) { die("NULL seed"); }
if (filter_var($seed, FILTER_VALIDATE_INT) === false) {
    die("Invalid seed integer");
} 

// Getting how many sentences we have, id must be contiguos
$count = "SELECT COUNT(1) FROM sentences";
if (!$result = $sql->query($count)) { die("Error retreiving row count."); }
// Generating id key from seed
$nSentences = $result->fetch_row()[0];
$key = ($seed % $nSentences) + 1;

$query = "SELECT text from sentences where id = $key";
if (!$result = $sql->query($query)) { die("Error retreiving row sentence."); }

// Remember there is no multiline support
echo $result->fetch_row()[0]; // Sending senstence to client


/*  STATISTICS */
$sql->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

$query = "SELECT * FROM statistics ORDER BY no DESC LIMIT 1";   // Getting last row
if (!$data = $sql->query($query)) { die("Error retreiving row statistics."); }
$result = $data->fetch_row();

date_default_timezone_set('Europe/Rome'); // Avoid messing with timezones in contructors

if($result != null) { // If table not empty
    // Get a DateTime object so we can diff on it with the current time
    $rowDate = new DateTime($result[1]);
    $elapsed = $rowDate->diff(new DateTime());
    
    // Check if we are in the same hour, it may happen that for days no one connects so check also days
    if($elapsed->h != 0 || $elapsed->days != 0) {
        newRow($sql); // Else insert a row
    } else {
        // Increment the requests field
        $query = "UPDATE statistics SET requests = $result[2] + 1 WHERE no = $result[0]";
        if (!$sql->query($query)) { die("Error updating statistics."); }
    }
} else {  // Else insert a row
    newRow($sql);
}

$sql->commit();

$sql->close();

/*###################################################################*/
function newRow($sql) {
    
    $now = new DateTime();
    
    $format = $now->format('Y-m-d H') . ":00:00";
 
    $insert = "INSERT INTO statistics VALUES(NULL, '$format', 1)";
    
    if (!$sql->query($insert)) { echo "Could not insert into database: " . $sql->error; }
}
