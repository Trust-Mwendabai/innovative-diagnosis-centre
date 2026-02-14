<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $query = "SELECT s.*, b.name as branch_name 
              FROM staff s 
              LEFT JOIN branches b ON s.branch_id = b.id 
              ORDER BY s.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "staff" => $staff
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
