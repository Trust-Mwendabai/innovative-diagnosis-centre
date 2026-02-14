<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->price)){
    try {
        $query = "INSERT INTO test_packages (name, test_ids, price, description) 
                  VALUES (:name, :test_ids, :price, :description)";
        
        $stmt = $conn->prepare($query);
        
        $name = htmlspecialchars(strip_tags($data->name));
        $test_ids = is_string($data->test_ids) ? $data->test_ids : json_encode($data->test_ids ?? []);
        $price = (float)$data->price;
        $description = htmlspecialchars(strip_tags($data->description ?? ''));
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':test_ids', $test_ids);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':description', $description);
        
        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, 1, "Created Package", "package", $newId, "Name: $name, Price: $price");
            
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Package created.", "id" => $newId));
        } else {
            throw new Exception("Unable to create package.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. name and price are required."));
}
?>
