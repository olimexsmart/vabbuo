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

	$query = "INSERT INTO mainButton VALUES(NULL, '$remote', '$remoteString', '$userAgent', NULL)";

	if(!$sql->query($query))
		echo "Could not insert into database: " . $sql->error;

	$sql->close(); 
?>



<!DOCTYPE html>
<html>
	<style>
		@font-face {
		font-family: "theconsolas";
		src: url(Consolas.ttf) format("truetype");
		}
		/* Let's inherit to all DOM child the font */
		body *{
			font-family: 'theconsolas';
		}
    </style>
	<head>
    <meta name="viewport" content="width=device-width">
        <title>Eh vabbuò</title>
        <script src='OSC.js'></script>
        <script src='utilities.js'></script>

	</head>
	<body style="background-color: hsl(120, 100%, 35%);">		
		<form action="/submitSentence.php" method="post">
			Nickname:<br> <input type="text" name="nickname"> <br>
			Sentence:<br> <textarea name="sentence" cols="40" rows="5"></textarea> <br><br>
					<input type="submit" value="Submit Sentence">
		
		<script>
			color = 120;
			setInterval("rainbow(document.body, 100, 35)", 400);
		</script>
	</body>
</html>

