<?php

echo file_get_contents("main.html");

// Insert page request into database
require_once 'AccessLogger.php';
$logger = new AccessLogger("mainButton");
$logger->log();
