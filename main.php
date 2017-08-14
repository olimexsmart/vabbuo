<?php
    // Database connection
    require_once 'login.php';
    $sql = new mysqli($hostName, $userName, $passWord, $dataBase);
	if ($sql->connect_error) {
		die($sql->connect_error);
	}

    // Getting informations
    $remote = ip2long($_SERVER['REMOTE_ADDR']);
    $remoteString = $_SERVER['REMOTE_ADDR'];
    $headers = apache_request_headers();
    $userAgent = $headers['User-Agent'];

    $query = "INSERT INTO mainButton VALUES(NULL, '$remote', '$remoteString', '$userAgent', NULL)";

	if (!$sql->query($query)) {
		echo "Could not insert into database: " . $sql->error;
	}

    $sql->close();

	echo file_get_contents("main.html");