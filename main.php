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
	<body>
	<title>Eh Vabbuò</title>
	<form action="/submitSentence.php">
		Nickname:<br> <input type="text" name="firstname" value="Bomber"> <br>
		Sentence:<br> <input type="text" name="lastname" value="Carpe Diem"> <br><br>
				<input type="submit" value="Submit Sentence">
	</form> <p>If you click the "Submit" button, the form-data will be sent to a page called "/action_page.php".</p>
	</body>
</html>

