<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';
include_once __DIR__ . '/../config/database.php';


try {
    $sql = file_get_contents(__DIR__ . '/../schema/health_metrics.sql');
    $conn->exec($sql);
    echo "Health Metrics table created successfully.\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
