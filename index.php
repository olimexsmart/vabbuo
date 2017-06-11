<?php 
	// Database connection
	require_once 'login.php';
	$sql = new mysqli($hostName, $userName, $passWord, $dataBase);
        if ($sql->connect_error) { die($sql->connect_error); }

	// Getting informations
	$remote = ip2long($_SERVER['REMOTE_ADDR']);
	$remoteString = $_SERVER['REMOTE_ADDR'];
	$headers = apache_request_headers();
	$userAgent = $headers['User-Agent'];

	$query = "INSERT INTO accessLog VALUES(NULL, '$remote', '$remoteString', '$userAgent', NULL)";

        if(!$sql->query($query)) { echo "Could not insert into database: " . $sql->error; }

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
	    cursor: pointer;
	}
	</style>
	<head>
	<meta name="viewport" content="width=device-width">
		<title>Eh vabbuò</title>
		<script src='OSC.js'></script>
                <script src='rainbow.js'></script>
                <script src="mainButton.js"></script>
	</head>
		<body style="background-color: hsl(120, 100%, 35%);">

		<canvas  id='mainButton' width='200' height='200'>
			This text is visible only if you don't have HTML5, sorry dude we are in 2017
		</canvas>

	<script>
                color = 120;
                setInterval("rainbow(document.body, 100, 35)", 400);
                drawButton();                
	</script>
	</body>
</html>

