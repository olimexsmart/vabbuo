<?php
// Insert page request into database
require_once 'AccessLogger.php';
$logger = new AccessLogger("accessLog");
$logger->log();

// First load the page
if($logger->Detect->isMobile() && !$logger->Detect->isTablet()) {
    echo file_get_contents("mobileStart.html");
} else {
    echo file_get_contents("start.html");
}


