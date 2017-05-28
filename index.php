<?php
	// Database connection
	require_once 'login.php';
	$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
	if ($sql->connect_error) die($sql->connect_error);

	// Getting informations
	$remote = ip2long($_SERVER['REMOTE_ADDR']);
	$remoteString = $_SERVER['REMOTE_ADDR'];
	$headers = apache_request_headers();
	$userAgent = $headers['User-Agent'];

	$query = "INSERT INTO accessLog VALUES(NULL, '$remote', '$remoteString', '$userAgent', NULL)";

	if(!$sql->query($query))
		echo "Could not insert into database: " . $sql->error;

	$sql->close();
?>




<html>
	<head>
	<meta name="viewport" content="width=device-width">
		<title>Eh vabbuò</title>
		<script src='timeUpdate.js'></script>
	</head>
	<body>
	<font size ="6">
		<p>Intanto che creo un sito decente beccati l'ora esatta: <br><br><span id='date'>Hey hey!</span> </p>
		<p>Vabbuò adesso è pure giusta e si aggiorna, che belle cose</p>
	</font>
	<script>
		setInterval("timeUpdate(document.getElementById('date'))", 1000)
	</script>
	</body>
</html>

