<?php
include_once 'api/config/database.php';

try {
    $name = 'Dr. Zambian Medic';
    $email = 'doctor@innovativediagnosiscentre.co.zm';
    $password = password_hash('doctor123', PASSWORD_BCRYPT);
    $role = 'doctor';
    
    // Check if exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo "Doctor user already exists.\n";
    } else {
        $stmt = $conn->prepare("INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $role, $password]);
        echo "Doctor account created successfully:\n";
        echo "Email: $email\n";
        echo "Password: doctor123\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
