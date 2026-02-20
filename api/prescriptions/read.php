<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $patient_id = isset($_GET['patient_id']) ? $_GET['patient_id'] : null;
    $doctor_id = isset($_GET['doctor_id']) ? $_GET['doctor_id'] : null;
    
    $query = "SELECT pr.*, p.name as patient_name 
              FROM prescriptions pr
              JOIN patients p ON pr.patient_id = p.id";
    
    $conditions = [];
    $params = [];
    
    if ($patient_id) {
        $conditions[] = "pr.patient_id = :patient_id";
        $params[':patient_id'] = $patient_id;
    }
    
    if ($doctor_id) {
        $conditions[] = "pr.doctor_id = :doctor_id";
        $params[':doctor_id'] = $doctor_id;
    }
    
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    $query .= " ORDER BY pr.created_at DESC";
    
    $stmt = $conn->prepare($query);
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val);
    }
    
    $stmt->execute();
    $prescriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array("success" => true, "prescriptions" => $prescriptions));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
