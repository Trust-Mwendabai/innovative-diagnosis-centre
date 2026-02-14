<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $query = "SELECT n.*, p.name as patient_name 
              FROM notification_logs n
              LEFT JOIN patients p ON n.patient_id = p.id
              ORDER BY n.sent_at DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "notifications" => $logs
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching notification logs: " . $e->getMessage()
    ));
}
?>
