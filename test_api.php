<?php
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';
$_SERVER['REQUEST_METHOD'] = 'GET';

$base_path = __DIR__;

function test_api($file) {
    global $base_path;
    echo "--- Testing $file ---\n";
    try {
        include $base_path . '/' . $file;
        echo "\n";
    } catch (Error $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

test_api('api/appointments/stats.php');
test_api('api/appointments/read.php');
test_api('api/patients/read.php');
?>
