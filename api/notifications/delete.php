<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    try {
        $query = "DELETE FROM notifications WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        $id = htmlspecialchars(strip_tags($data->id));
        $stmt->bindParam(':id', $id);
        
        if($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Notification deleted successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Unable to delete notification."));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. ID is required."));
}
?>
