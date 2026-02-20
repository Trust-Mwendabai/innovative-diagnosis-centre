<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if (empty($_GET['patient_id'])) {
        throw new Exception("Patient ID is required.");
    }
    
    $patient_id = (int)$_GET['patient_id'];
    
    // Optimized query fetching only necessary result data
    $query = "SELECT id, test_name, status, uploaded_at, technician_name, file_path 
              FROM test_results 
              WHERE patient_id = :patient_id 
              ORDER BY uploaded_at DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':patient_id', $patient_id);
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
