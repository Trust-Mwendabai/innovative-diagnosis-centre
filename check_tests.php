<?php
include_once __DIR__ . '/api/config/database.php';
$stmt = $conn->query("SELECT id, name, price FROM tests LIMIT 5");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_PRETTY_PRINT);
?>
