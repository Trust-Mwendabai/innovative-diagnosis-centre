<?php
include_once 'api/config/database.php';

try {
    echo "--- Doctor User Audit ---\n";
    $stmt = $conn->query("SELECT name, email, role FROM users WHERE role = 'doctor'");
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($doctors)) {
        echo "No doctors found in the system.\n";
    } else {
        foreach ($doctors as $doctor) {
            echo "Doctor: " . $doctor['name'] . " (" . $doctor['email'] . ")\n";
        }
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
