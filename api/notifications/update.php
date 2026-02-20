<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->message) && !empty($data->recipient_group)) {
    try {
        $query = "UPDATE notifications SET 
                    recipient_group = :recipient_group,
                    title = :title,
                    message = :message
                  WHERE id = :id";
        
        $stmt = $conn->prepare($query);
        
        $recipient_group = htmlspecialchars(strip_tags($data->recipient_group));
        $title = !empty($data->title) ? htmlspecialchars(strip_tags($data->title)) : 'System Notification';
        $message = htmlspecialchars(strip_tags($data->message));
        $id = htmlspecialchars(strip_tags($data->id));

        // Logic to handle group mapping if needed (similar to create.php)
        if ($recipient_group === 'all_patients') {
            $recipient_group = 'patient';
        } elseif ($recipient_group === 'all_doctors') {
            $recipient_group = 'doctor';
        } elseif ($recipient_group === 'all_staff') {
             $recipient_group = 'staff'; // Assuming staff role exists
        }

        $stmt->bindParam(':recipient_group', $recipient_group);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':message', $message);
        $stmt->bindParam(':id', $id);
        
        if($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Notification updated successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Unable to update notification."));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. ID, Message and Recipient Group required."));
}
?>
