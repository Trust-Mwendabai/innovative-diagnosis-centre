<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->price)){
    try {
        $query = "INSERT INTO tests (name, category, price, description, preparation) 
                  VALUES (:name, :category, :price, :description, :preparation)";
        
        $stmt = $conn->prepare($query);
        
        $name = htmlspecialchars(strip_tags($data->name));
        $category = htmlspecialchars(strip_tags($data->category ?? 'General'));
        $price = (float)$data->price;
        $description = htmlspecialchars(strip_tags($data->description ?? ''));
        $preparation = htmlspecialchars(strip_tags($data->preparation ?? 'None'));
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':preparation', $preparation);
        
        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, 1, "Created Test", "test", $newId, "Name: $name, Price: $price");
            
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Test created.", "id" => $newId));
        } else {
            throw new Exception("Unable to create test.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. Default values: name and price are required."));
}
?>
