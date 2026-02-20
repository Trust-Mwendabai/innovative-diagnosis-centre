<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';

include_once 'api/config/database.php';

echo "Database Connection: " . (isset($conn) ? "ACTIVE" : "FAILED") . "\n";

if (isset($conn)) {
    try {
        $tables = ['users', 'patients', 'appointments', 'health_metrics', 'tests'];
        foreach ($tables as $table) {
            $stmt = $conn->query("SELECT COUNT(*) FROM $table");
            $count = $stmt->fetchColumn();
            echo "Table $table: $count records\n";
        }
        
        echo "\nSample Patient Data:\n";
        $stmt = $conn->query("SELECT * FROM patients LIMIT 1");
        print_r($stmt->fetch(PDO::FETCH_ASSOC));
        
        echo "\nSample Appointment Data:\n";
        $stmt = $conn->query("SELECT * FROM appointments LIMIT 1");
        print_r($stmt->fetch(PDO::FETCH_ASSOC));
        
    } catch (Exception $e) {
        echo "DATABASE ERROR: " . $e->getMessage() . "\n";
    }
}
?>
