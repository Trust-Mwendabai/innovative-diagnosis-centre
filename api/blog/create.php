<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->title) && !empty($data->content)){
    try {
        $query = "INSERT INTO blog_posts (title, excerpt, content, category, author_id, status) 
                  VALUES (:title, :excerpt, :content, :category, :author_id, :status)";
        
        $stmt = $conn->prepare($query);
        
        $title = htmlspecialchars(strip_tags($data->title));
        $excerpt = htmlspecialchars(strip_tags($data->excerpt ?? ''));
        $content = $data->content; // Rich text
        $category = htmlspecialchars(strip_tags($data->category ?? 'Health'));
        $author_id = 1; // Default admin
        $status = htmlspecialchars(strip_tags($data->status ?? 'draft'));
        
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':excerpt', $excerpt);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':author_id', $author_id);
        $stmt->bindParam(':status', $status);
        
        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, $author_id, "Created Blog Post", "blog", $newId, "Title: $title");
            
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Blog post created.", "id" => $newId));
        } else {
            throw new Exception("Unable to create post.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. Title and content required."));
}
?>
