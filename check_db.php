<?php
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';
$_SERVER['REQUEST_METHOD'] = 'GET';

include 'api/config/database.php';

echo "Checking Database Tables:\n";
$stmt = $conn->query('SHOW TABLES');
while ($row = $stmt->fetch()) {
    echo "- " . $row[0] . "\n";
}

echo "\nChecking 'staff' table structure:\n";
try {
    $stmt = $conn->query('DESCRIBE staff');
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
} catch (Exception $e) {
    echo "Error describing staff: " . $e->getMessage() . "\n";
}
?>
