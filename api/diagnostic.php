<?php
/**
 * IDC Production Sync Diagnostic Node
 * Run this script on the server to identify connectivity or schema issues.
 */

header("Content-Type: text/plain");
echo "=== IDC PRODUCTION DIAGNOSTIC START ===\n\n";

// 1. PHP Environment
echo "[1] System Audit:\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Name: " . $_SERVER['SERVER_NAME'] . "\n";
echo "Server Addr: " . (isset($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : 'Not Set') . "\n";
echo "PDO Loaded: " . (extension_loaded('pdo_mysql') ? 'YES' : 'NO') . "\n";

// 2. Load Configuration
echo "\n[2] Configuration Linkage:\n";
if (file_exists('config/database.php')) {
    echo "Found config/database.php\n";
    // Mock SERVER variables to force production path if needed during test
    // include 'config/database.php';
} else {
    echo "CRITICAL: config/database.php NOT FOUND\n";
}

// 3. Database Connectivity Check
echo "\n[3] Database Connectivity Probe:\n";
// Manual connection test using the credentials found in database.php
$host = 'localhost';
$db_name = 'trustmwe_idc'; 
$username = 'trustmwe_idc';
$password = 'mF*C8t)QuIqr';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "SUCCESS: Database link established.\n";
    
    // 4. Schema Verification
    echo "\n[4] Critical Table Verification:\n";
    $tables = ['users', 'patients', 'appointments', 'tests', 'test_packages'];
    foreach ($tables as $table) {
        $stmt = $conn->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "LINKED: Table '$table' exists.\n";
        } else {
            echo "UNLINKED: Table '$table' MISSING.\n";
        }
    }
    
    // 5. Admin User Verification
    echo "\n[5] Identity Protocol Verification:\n";
    $stmt = $conn->query("SELECT COUNT(*) FROM users");
    echo "Users Count: " . $stmt->fetchColumn() . "\n";

} catch(PDOException $e) {
    echo "FAILURE: Connection error - " . $e->getMessage() . "\n";
    echo "Check if DB name, username, and password are correct for the production server.\n";
}

echo "\n=== IDC PRODUCTION DIAGNOSTIC END ===\n";
?>
