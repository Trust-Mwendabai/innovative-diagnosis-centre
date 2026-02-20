<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->message) && !empty($data->recipient_group)){
    try {
        $query = "INSERT INTO notifications (recipient_group, recipient_id, title, message) VALUES (:recipient_group, :recipient_id, :title, :message)";
        $stmt = $conn->prepare($query);

        $recipient_group = htmlspecialchars(strip_tags($data->recipient_group));
        $recipient_id = isset($data->recipient_id) ? htmlspecialchars(strip_tags($data->recipient_id)) : null;
        $title = !empty($data->title) ? htmlspecialchars(strip_tags($data->title)) : 'System Notification';
        $message = htmlspecialchars(strip_tags($data->message));

        // If 'all_patients' is selected, we broadcast to 'patient' group without specific ID
        if ($recipient_group === 'all_patients') {
            $recipient_group = 'patient';
            $recipient_id = null;
        } elseif ($recipient_group === 'all_doctors') {
            $recipient_group = 'doctor';
            $recipient_id = null;
        }

        $stmt->bindParam(':recipient_group', $recipient_group);
        $stmt->bindParam(':recipient_id', $recipient_id);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':message', $message);

        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, 1, "Sent Notification", "notification", $newId, "Group: $recipient_group");
            
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
