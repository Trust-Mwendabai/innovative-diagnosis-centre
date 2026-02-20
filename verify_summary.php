<?php
// Mocking GET for CLI
$_GET['id'] = 1;
include_once __DIR__ . '/api/patients/summary.php';
?>
