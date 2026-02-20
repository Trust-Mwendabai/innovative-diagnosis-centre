<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    
    $query = "SELECT r.*, p.name as patient_name, a.date as appointment_date, t.name as test_name, s.name as technician_name
              FROM test_results r
              JOIN patients p ON r.patient_id = p.id
              JOIN appointments a ON r.appointment_id = a.id
              LEFT JOIN tests t ON a.test_id = t.id
              LEFT JOIN staff s ON r.technician_id = s.id";
              
    if ($status) {
        $query .= " WHERE r.status = :status";
    }
    
    $query .= " ORDER BY r.uploaded_at DESC";
              
    $stmt = $conn->prepare($query);
    if ($status) {
        $stmt->bindParam(':status', $status);
    }
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "results" => $results
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching results: " . $e->getMessage()
    ));
}
?>
