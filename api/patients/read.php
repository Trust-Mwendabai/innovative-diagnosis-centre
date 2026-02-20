<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $search = isset($_GET['search']) ? $_GET['search'] : "";
    
    $query = "SELECT p.*, 
                (SELECT COUNT(*) FROM appointments WHERE patient_id = p.id) as total_appointments,
                (SELECT MAX(date) FROM appointments WHERE patient_id = p.id) as last_test_date
              FROM patients p";
              
    if (!empty($search)) {
        $query .= " WHERE p.name LIKE :search OR p.email LIKE :search OR p.phone LIKE :search";
    }
    
    $query .= " ORDER BY p.name ASC";
              
    $stmt = $conn->prepare($query);
    if (!empty($search)) {
        $searchTerm = "%$search%";
        $stmt->bindParam(':search', $searchTerm);
    }
    $stmt->execute();
    
    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "patients" => $patients
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching patients: " . $e->getMessage()
    ));
}
?>
