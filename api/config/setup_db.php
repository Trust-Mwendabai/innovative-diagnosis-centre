<?php
$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `zambia_test_booking`");
    echo "Database created successfully or already exists.\n";

    // Select database
    $pdo->exec("USE `zambia_test_booking`");

    // Read SQL file
    $sqlFile = __DIR__ . '/../../database.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }
    
    $sql = file_get_contents($sqlFile);
    if (!$sql) {
        throw new Exception("Unable to read SQL file");
    }
    
    // Execute SQL commands
    // Split by semicolon because PDO exec might not handle multiple statements well depending on driver
    // But MySQL driver usually does if creating tables. But let's try direct exec first.
    $pdo->exec($sql);
    echo "Tables created successfully.\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
