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



<html>
	<style>
	#mainButton {
	    position: absolute;
	    top:0;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    margin:auto;
	}
	</style>
	<head>
	<meta name="viewport" content="width=device-width">
		<title>Eh vabbuò</title>
		<script src='timeUpdate.js'></script>
		<script src='OSC.js'></script>
		<script src='rainbow.js'></script>
	</head>

	<body style="background-color: hsl(120, 100%, 35%);">
		<font size ="6">
			<p>Intanto che creo un sito decente beccati l'ora esatta: <br><br><span id='date'>Hey hey!</span> </p>
			<p>Vabbuò dai non facciamo i difficili, ora c'è pure la seconda pagina!</p>
		</font>

		<script>
			setInterval("timeUpdate(document.getElementById('date'))", 1000);
			color = 120;
			setInterval("rainbow(document.body, 100, 35)", 400);
		</script>
	</body>
</html>

