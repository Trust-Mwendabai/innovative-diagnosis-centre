<?php
include_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/audit_logger.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : null;
    $doctor_id = isset($_GET['doctor_id']) ? (int)$_GET['doctor_id'] : null;

    $query = "SELECT p.*, d.name as doctor_name, u.name as patient_name 
              FROM prescriptions p
              JOIN users d ON p.doctor_id = d.id
              JOIN users u ON p.patient_id = u.id";
    
    $where = [];
    $params = [];

    if ($patient_id) {
        $where[] = "p.patient_id = :patient_id";
        $params[':patient_id'] = $patient_id;
    }

    if ($doctor_id) {
        $where[] = "p.doctor_id = :doctor_id";
        $params[':doctor_id'] = $doctor_id;
    }

    if (!empty($where)) {
        $query .= " WHERE " . implode(" AND ", $where);
    }

    $query .= " ORDER BY p.date_prescribed DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Log the read event if it's for a specific patient
    if ($patient_id) {
        logAudit("VIEW_PRESCRIPTIONS", "patient", $patient_id, ["count" => count($prescriptions)]);
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "prescriptions" => $prescriptions
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
