<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->message) && !empty($data->recipient_group)){
    try {
        $query = "INSERT INTO notifications 
                  (recipient_group, recipient_id, title, message, type, category, sent_by_id, sent_by_name) 
                  VALUES (:recipient_group, :recipient_id, :title, :message, :type, :category, :sent_by_id, :sent_by_name)";
        $stmt = $conn->prepare($query);

        $recipient_group = htmlspecialchars(strip_tags($data->recipient_group));
        $recipient_id = isset($data->recipient_id) ? (int)$data->recipient_id : null;
        $title = !empty($data->title) ? htmlspecialchars(strip_tags($data->title)) : 'System Notification';
        $message = htmlspecialchars(strip_tags($data->message));
        $type = !empty($data->type) ? htmlspecialchars(strip_tags($data->type)) : 'system';
        $sent_by_id = isset($data->sent_by_id) ? (int)$data->sent_by_id : null;
        $sent_by_name = !empty($data->sent_by_name) ? htmlspecialchars(strip_tags($data->sent_by_name)) : null;

        // Determine category based on recipient_group
        if ($recipient_group === 'everyone') {
            $category = 'general';
        } elseif ($recipient_group === 'all_patients' || $recipient_group === 'patient') {
            $recipient_group = 'patient';
            $recipient_id = null;
            $category = 'role_based';
        } elseif ($recipient_group === 'all_doctors' || $recipient_group === 'doctor') {
            $recipient_group = 'doctor';
            $recipient_id = null;
            $category = 'role_based';
        } elseif ($recipient_group === 'individual') {
            $category = 'individual';
        } else {
            $category = !empty($data->category) ? htmlspecialchars(strip_tags($data->category)) : 'general';
        }

        $stmt->bindParam(':recipient_group', $recipient_group);
        $stmt->bindParam(':recipient_id', $recipient_id);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':message', $message);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':sent_by_id', $sent_by_id);
        $stmt->bindParam(':sent_by_name', $sent_by_name);

        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, 1, "Sent Notification", "notification", $newId, "Category: $category | Group: $recipient_group");
            
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Notification dispatched.", "id" => $newId));
        } else {
            throw new Exception("Unable to send notification.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. Message and Recipient Group required."));
}
?>
