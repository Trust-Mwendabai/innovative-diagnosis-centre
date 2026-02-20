<?php
include_once __DIR__ . '/api/config/database.php';
$stmt = $conn->query("SELECT id, patient_id, test_id, total_price, status FROM appointments LIMIT 5");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_PRETTY_PRINT);
?>
