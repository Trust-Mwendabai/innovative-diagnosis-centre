<?php
include_once 'database.php';

try {
    $email = 'admin@innovativediagnosiscentre.co.zm';
    $password = 'admin123';
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Update password for admin user
    $query = "UPDATE users SET password = :password WHERE email = :email";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':email', $email);
    
    if($stmt->execute()) {
        echo "Password reset successfully for $email\n";
        echo "New password: $password\n";
    } else {
        echo "Failed to reset password.\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
