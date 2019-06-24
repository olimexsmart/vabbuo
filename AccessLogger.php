<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Include and instantiate the class.
require_once 'Mobile_Detect.php';


class AccessLogger 
{
    private $sql;
    private $table;
    private $apiKey;
    // Make them visible in case other portions of code needs them
    public $IP;
    public $Detect;
    public $Headers;
    public $Geolocation;
    public $UserAgent;    
    
    // The table is needed because each page has its own
    // instead of one enormous one with all pages
    function __construct ($table) {
        // Database connection
        require_once 'login.php';
        $this->sql = new mysqli($hostName, $userName, $passWord, $dataBase);        
        if ($this->sql->connect_error) {
            die($this->sql->connect_error);
        }        
        $this->table = $table;
        $this->apiKey = $apiKey;
    }

    function log() {
        // Getting information
        $this->Detect = new Mobile_Detect;
        $device = "";
        // First load the page
        if($this->Detect->isMobile() && !$this->Detect->isTablet()){            
            $device = "mobile";
        } else {            
            $device = "PC";
        }
        // Just check if tablet
        if($this->Detect->isTablet()) {
            $device = "tablet";
        }


        $this->IP = $_SERVER['REMOTE_ADDR'];
        $this->Headers = apache_request_Headers();
        $this->UserAgent = preg_replace("/\'/", "\'", $this->Headers['User-Agent']);

        $geolocate = json_decode(file_get_contents("http://api.ipstack.com/$this->IP?access_key=$this->apiKey&output=json&legacy=1"), true);
	if (isset($geolocate['country_name'])) {
	     $this->Geolocation = preg_replace("/\'/", "\'",  $geolocate['country_name'] . ', ' . $geolocate['region_name'] . ', ' . $geolocate['city']);
	} else {
	     $this->Geolocation = '';
	}

        $query = "INSERT INTO $this->table VALUES(NULL, NULL, '$this->IP', '$device', '$this->Geolocation', '$this->UserAgent')";        
        if (!$this->sql->query($query)) {
            echo "Could not insert into database: " . $this->sql->error;
        }

        $this->sql->close();
    }
}
?>
