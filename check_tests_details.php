<?php
include_once __DIR__ . '/api/config/database.php';
$stmt = $conn->query("DESCRIBE tests");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . " (" . $row['Type'] . ")\n";
}
echo "----\n";
$stmt = $conn->query("SELECT id, name, price FROM tests LIMIT 10");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['id'] . " | " . $row['name'] . " | " . $row['price'] . "\n";
}
?>
