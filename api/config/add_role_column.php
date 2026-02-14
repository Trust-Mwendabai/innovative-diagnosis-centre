<?php
include_once 'database.php';

try {
    // Add role column if it doesn't exist
    $query = "SHOW COLUMNS FROM users LIKE 'role'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        $conn->exec("ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user' AFTER email");
        echo "Column 'role' added successfully.\n";
    } else {
        echo "Column 'role' already exists.\n";
    }

    // Set role for admin user
    $query = "UPDATE users SET role = 'admin' WHERE email = 'admin@innovativediagnosiscentre.co.zm'";
    $conn->exec($query);
    echo "Admin role updated.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
