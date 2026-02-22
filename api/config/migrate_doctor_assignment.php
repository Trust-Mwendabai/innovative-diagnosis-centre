<?php
include_once __DIR__ . '/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Add doctor_id to patients table
    $query1 = "ALTER TABLE patients ADD COLUMN doctor_id INT DEFAULT NULL";
    $conn->exec($query1);
    
    $query2 = "ALTER TABLE patients ADD CONSTRAINT fk_patient_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL";
    $conn->exec($query2);
    echo "Successfully added doctor_id to patients table.\n";

    // Add doctor_id to appointments table
    $query3 = "ALTER TABLE appointments ADD COLUMN doctor_id INT DEFAULT NULL";
    $conn->exec($query3);
    
    $query4 = "ALTER TABLE appointments ADD CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL";
    $conn->exec($query4);
    echo "Successfully added doctor_id to appointments table.\n";

    echo json_encode(["success" => true, "message" => "Migration completed successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Migration failed: " . $e->getMessage()]);
}
?>
