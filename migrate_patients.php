<?php
include_once __DIR__ . '/api/config/database.php';
try {
    $conn->exec("ALTER TABLE patients ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10) NULL AFTER gender");
    $conn->exec("ALTER TABLE patients ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2) NULL AFTER blood_group");
    $conn->exec("ALTER TABLE patients ADD COLUMN IF NOT EXISTS height DECIMAL(5,2) NULL AFTER weight");
    echo "Columns added successfully";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
