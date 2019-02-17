<?php
// $myFile = "general.json";
// $fh = fopen($myFile, 'w') or die("can't open file");
$inputvalues = $_POST;
file_put_contents('file.txt', $inputvalues['data']);
// $stringData = $_GET["data"];
// fwrite($fh, $stringData);
// fclose($fh)
?>