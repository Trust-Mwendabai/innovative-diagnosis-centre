<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)){
    try {
        // Log action first to get the name if possible, or just ID
        $query = "DELETE FROM tests WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);
        
        if($stmt->execute()){
            logActivity($conn, 1, "Deleted Test", "test", $data->id, "Test removed from catalog.");
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Test deleted."));
        } else {
            throw new Exception("Unable to delete test.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Test ID is required."));
}
?>
