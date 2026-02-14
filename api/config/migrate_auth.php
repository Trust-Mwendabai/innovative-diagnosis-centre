<?php
include_once __DIR__ . '/../config/database.php';

try {
    // 1. Update users table
    $conn->exec("ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50) UNIQUE AFTER email,
        ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10) AFTER password,
        ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP NULL AFTER otp_code,
        MODIFY COLUMN role ENUM('admin', 'staff', 'doctor', 'patient') DEFAULT 'patient'");
    echo "Users table updated.\n";

    // 2. Update appointments table
    $conn->exec("ALTER TABLE appointments 
        ADD COLUMN IF NOT EXISTS patient_id INT FIRST,
        ADD FOREIGN KEY IF NOT EXISTS (patient_id) REFERENCES patients(id) ON DELETE SET NULL");
    echo "Appointments table updated.\n";

    echo "Migration completed successfully.\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
