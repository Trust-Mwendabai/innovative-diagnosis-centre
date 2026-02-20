<?php
include_once __DIR__ . '/api/config/database.php';

$sql = file_get_contents(__DIR__ . '/api/schema/prescriptions.sql');

try {
    $conn->exec($sql);
    echo "Prescriptions table created successfully.";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>
