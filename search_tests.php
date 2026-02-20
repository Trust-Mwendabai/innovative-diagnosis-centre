<?php
include_once __DIR__ . '/api/config/database.php';
$stmt = $conn->prepare("SELECT id, name FROM tests WHERE name LIKE :query");
$query = "%rbs%";
$stmt->bindParam(':query', $query);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_PRETTY_PRINT);
?>
