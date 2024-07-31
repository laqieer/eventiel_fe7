<?php 
$username = "b33_13495215"; 
$password = "z0mbiesa"; 
$url = "ftp://ftp.byethost33.com/htdocs/FE_database.txt"; // IP address also works in place of domain.com 
$hostname= "ftp://$username:$password@$url"; 
 
if ($_POST['action'] === 'Save') { 
	$opts = array( 
	'ftp'=>array( 
	'overwrite'=> true 
	) 
); 
 
$txa_finalOutput = stream_context_create($opts); 
 
file_put_contents($hostname, $_POST['txa_finalOutput'], false, $txa_finalOutput) or die("Could not save changes"); 
} 
 
$txa_finalOutput= file_get_contents($hostname); 
?>