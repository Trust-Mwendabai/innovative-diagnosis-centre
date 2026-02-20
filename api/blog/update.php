<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->title) && !empty($data->content)){
    try {
        $query = "UPDATE blog_posts 
                  SET title = :title, 
                      excerpt = :excerpt, 
                      content = :content, 
                      category = :category, 
                      status = :status,
                      image = :image
                  WHERE id = :id";
        
        $stmt = $conn->prepare($query);
        
        $id = htmlspecialchars(strip_tags($data->id));
        $title = htmlspecialchars(strip_tags($data->title));
        $excerpt = htmlspecialchars(strip_tags($data->excerpt ?? ''));
        $content = $data->content; // Rich text
        $category = htmlspecialchars(strip_tags($data->category ?? 'Health'));
        $status = htmlspecialchars(strip_tags($data->status ?? 'draft'));
        $image = $data->image ?? '';
        
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':excerpt', $excerpt);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':image', $image);
        $stmt->bindParam(':id', $id);
        
        if($stmt->execute()){
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Blog post updated."));
        } else {
            throw new Exception("Unable to update post.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. ID, title and content required."));
}
?>
