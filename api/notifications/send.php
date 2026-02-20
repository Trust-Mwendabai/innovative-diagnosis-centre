<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->patient_id) && !empty($data->message)){
    try {
        $query = "INSERT INTO notification_logs (patient_id, type, recipient, message, status) 
                  VALUES (:patient_id, :type, :recipient, :message, :status)";
        
        $stmt = $conn->prepare($query);
        
        $patient_id = (int)$data->patient_id;
        $type = htmlspecialchars(strip_tags($data->type ?? 'SMS'));
        $recipient = htmlspecialchars(strip_tags($data->recipient ?? ''));
        $message = htmlspecialchars(strip_tags($data->message));
        $status = "sent"; // Mocking successful send
        
        $stmt->bindParam(':patient_id', $patient_id);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':recipient', $recipient);
        $stmt->bindParam(':message', $message);
        $stmt->bindParam(':status', $status);
        
        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, 1, "Sent Notification", "notification", $newId, "Type: $type to $recipient");
            
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Notification sent/logged.", "id" => $newId));
        } else {
            throw new Exception("Unable to log notification.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. Patient ID and message required."));
}
?>
