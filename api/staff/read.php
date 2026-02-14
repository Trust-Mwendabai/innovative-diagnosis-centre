<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $branch_id = isset($_GET['branch_id']) ? $_GET['branch_id'] : null;
    
    $query = "SELECT s.*, b.name as branch_name 
              FROM staff s
              LEFT JOIN branches b ON s.branch_id = b.id";
              
    if ($branch_id) {
        $query .= " WHERE s.branch_id = :branch_id";
    }
              
    $stmt = $conn->prepare($query);
    if ($branch_id) {
        $stmt->bindParam(':branch_id', $branch_id);
    }
    $stmt->execute();
    
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "staff" => $staff
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching staff: " . $e->getMessage()
    ));
}
?>
