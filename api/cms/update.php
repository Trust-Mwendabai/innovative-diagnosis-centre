<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && isset($data->content_value)){
    try {
        $query = "UPDATE cms_content SET content_value = :content_value WHERE id = :id";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':content_value', $data->content_value);
        $stmt->bindParam(':id', $data->id);
        
        if($stmt->execute()){
            logActivity($conn, 1, "Updated CMS Content", "cms", $data->id, "Content updated.");
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Content updated."));
        } else {
            throw new Exception("Unable to update content.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. ID and value required."));
}
?>
