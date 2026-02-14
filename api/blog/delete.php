<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)){
    try {
        $query = "DELETE FROM blog_posts WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);
        
        if($stmt->execute()){
            logActivity($conn, 1, "Deleted Blog Post", "blog", $data->id, "Article removed.");
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Post deleted."));
        } else {
            throw new Exception("Unable to delete post.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Post ID is required."));
}
?>
