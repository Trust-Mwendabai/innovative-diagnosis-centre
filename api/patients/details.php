<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if (empty($_GET['id'])) {
        throw new Exception("Patient ID is required.");
    }
    
    $id = (int)$_GET['id'];
    
    // Get patient info
    $query = "SELECT * FROM patients WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $patient = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$patient) {
        throw new Exception("Patient not found.");
    }
    
    // Get appointment history
    $query = "SELECT a.*, s.name as staff_name, b.name as branch_name 
              FROM appointments a
              LEFT JOIN staff s ON a.staff_id = s.id
              LEFT JOIN branches b ON a.branch_id = b.id
              WHERE a.patient_id = :id
              ORDER BY a.date DESC, a.time DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get test results
    $query = "SELECT * FROM test_results WHERE patient_id = :id ORDER BY uploaded_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "patient" => $patient,
        "history" => $history,
        "results" => $results
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching patient details: " . $e->getMessage()
    ));
}
?>
