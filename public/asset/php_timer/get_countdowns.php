<?php
$countdowns = json_decode(file_get_contents('countdowns.json'), true);
echo json_encode($countdowns);
?>