<?php
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';
$_SERVER['REQUEST_METHOD'] = 'GET';

function check_file($path) {
    echo "Checking $path: " . (file_exists($path) ? "EXISTS" : "MISSING") . "\n";
}

echo "API File Audit:\n";
check_file('api/tests/read.php');
check_file('api/packages/read.php');
check_file('api/branches/read.php');
check_file('api/patients/details.php');
check_file('api/patients/summary.php');

echo "\nTesting Endpoints (Internal Call):\n";

function test_endpoint($path) {
    $start = microtime(true);
    try {
        ob_start();
        include $path;
        $output = ob_get_clean();
        $end = microtime(true);
        $time = round(($end - $start) * 1000, 2);
        echo "[$path] took $time ms. Status: SUCCESS\n";
        // echo "Output: " . substr($output, 0, 100) . "...\n";
    } catch (Exception $e) {
        ob_get_clean();
        $end = microtime(true);
        $time = round(($end - $start) * 1000, 2);
        echo "[$path] took $time ms. Status: ERROR - " . $e->getMessage() . "\n";
    }
}

// Map parameters for scripts that need them
$_GET['id'] = 1; // Assuming patient ID 1 exists
$_GET['patient_id'] = 1;

test_endpoint('api/tests/read.php');
test_endpoint('api/packages/read.php');
test_endpoint('api/branches/read.php');
test_endpoint('api/patients/details.php');
test_endpoint('api/patients/summary.php');
?>
