<?php
// Include CORS configuration
require_once "cors.php";

// Environment Detection
// Environment Detection
$http_host = $_SERVER['HTTP_HOST'] ?? '';
$server_name = $_SERVER['SERVER_NAME'] ?? '';
$is_cli = PHP_SAPI === 'cli';

$is_local = $is_cli || 
             in_array($server_name, ['localhost', '127.0.0.1', '::1']) || 
             strpos($http_host, 'localhost') !== false ||
             strpos($http_host, '127.0.0.1') !== false ||
             strpos($http_host, '192.168.') !== false ||
             strpos($http_host, '10.') === 0;

$is_production = !$is_local;


if ($is_production) {
    // Production Credentials (to be filled by user in cPanel)
    $host = 'localhost'; // Usually localhost in cPanel
    $db_name = 'trustmwe_idc'; 
    $username = 'trustmwe_idc';
    $password = 'mF*C8t)QuIqr';
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
