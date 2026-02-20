<?php
include_once __DIR__ . '/api/config/database.php';
$stmt = $conn->query("DESCRIBE appointments");
$fields = [];
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $fields[] = $row['Field'] . " (" . $row['Type'] . ")";
}
echo implode(", ", $fields);
?>
