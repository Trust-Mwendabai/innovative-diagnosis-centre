<?php
// Include CORS configuration
require_once "cors.php";

// Environment Detection
$is_production = $_SERVER['SERVER_NAME'] !== 'localhost' && $_SERVER['SERVER_ADDR'] !== '127.0.0.1';

if ($is_production) {
    // Production Credentials (to be filled by user in cPanel)
    $host = 'localhost'; // Usually localhost in cPanel
    $db_name = 'u123456789_idc'; 
    $username = 'u123456789_admin';
    $password = 'Your_Strong_Password_Here';
} else {
    // Development Credentials
    $host = 'localhost';
    $db_name = 'zambia_test_booking';
    $username = 'root';
    $password = '';
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Secure connection failure: DB linkage disrupted."]);
    exit();
}
?>
