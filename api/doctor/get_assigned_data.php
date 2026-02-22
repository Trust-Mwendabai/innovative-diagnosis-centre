<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$doctor_id = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : 0;

if ($doctor_id > 0) {
    try {
        // Fetch assigned patients (directly or via appointments)
        $patients_query = "SELECT DISTINCT p.* 
                          FROM patients p 
                          LEFT JOIN appointments a ON p.id = a.patient_id 
                          WHERE p.doctor_id = :doctor_id OR a.doctor_id = :doctor_id 
                          ORDER BY p.name ASC";
        $p_stmt = $conn->prepare($patients_query);
        $p_stmt->bindParam(':doctor_id', $doctor_id);
        $p_stmt->execute();
        $patients = $p_stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch assigned appointments
        $appointments_query = "SELECT a.*, p.name as patient_name 
                               FROM appointments a 
                               LEFT JOIN patients p ON a.patient_id = p.id 
                               WHERE a.doctor_id = :doctor_id OR p.doctor_id = :doctor_id
                               ORDER BY a.date DESC, a.time DESC";
        $a_stmt = $conn->prepare($appointments_query);
        $a_stmt->bindParam(':doctor_id', $doctor_id);
        $a_stmt->execute();
        $appointments = $a_stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true, 
            "patients" => $patients, 
            "appointments" => $appointments
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "doctor_id is required."]);
}
?>
