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
	</head>
		<body style="background-color:green;">
		<font size ="6">
			<p>Intanto che creo un sito decente beccati l'ora esatta: <br><br><span id='date'>Hey hey!</span> </p>
			<p>Vabbuò dai non facciamo i difficili, si aggiorna pure da sola</p>
		</font>

		<canvas  id='mainButton' width='200' height='200'>
			This text is visible only if you don't have HTML5, sorry dude we are in 2017
		</canvas>


	<script>
		r = 100
		ri = 70
		setInterval("timeUpdate(document.getElementById('date'))", 1000)

		window.onload = window.onresize = function() {
 			var canvas = document.getElementById('canvas');
			canvas.width = window.innerWidth * 0.8;
			canvas.height = window.innerHeight * 0.8;
		}

		canvas = O('mainButton')
		context = canvas.getContext('2d')
		context.fillStyle = 'DarkGreen'
		canvas.addEventListener('click', function() {window.location.href = '/main.php'; }, false);

		// This part could be done also using the with(context) statement
		context.beginPath()
		context.moveTo(r, r)
		context.arc(r, r, r, 0, Math.PI * 2, false)
		context.fill()
		context.beginPath()
		context.arc(r, r, ri, 0, Math.PI * 2, false)
		context.fillStyle = 'green'
		context.fill();
		context.closePath()

//		context.beginPath()
//		moveTo(r, r)
//		context.closePath()

	</script>
	</body>
</html>

