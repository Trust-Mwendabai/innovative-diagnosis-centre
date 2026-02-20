<?php
include_once __DIR__ . '/api/config/database.php';
$stmt = $conn->query("DESCRIBE tests");
$fields = [];
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $fields[] = $row['Field'];
}
echo implode(", ", $fields) . "\n";
?>
