<?php
include_once 'api/config/database.php';
$stmt = $conn->query("SHOW COLUMNS FROM blog_posts");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . "\n";
}
?>
