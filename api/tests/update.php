<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)){
    try {
        $fields = [];
        $params = [':id' => (int)$data->id];
        
        if(isset($data->name)) {
            $fields[] = "name = :name";
            $params[':name'] = htmlspecialchars(strip_tags($data->name));
        }
        if(isset($data->category)) {
            $fields[] = "category = :category";
            $params[':category'] = htmlspecialchars(strip_tags($data->category));
        }
        if(isset($data->price)) {
            $fields[] = "price = :price";
            $params[':price'] = (float)$data->price;
        }
        if(isset($data->description)) {
            $fields[] = "description = :description";
            $params[':description'] = htmlspecialchars(strip_tags($data->description));
        }
        if(isset($data->preparation)) {
            $fields[] = "preparation = :preparation";
            $params[':preparation'] = htmlspecialchars(strip_tags($data->preparation));
        }
        
        if(empty($fields)) {
            throw new Exception("No fields to update.");
        }
        
        $query = "UPDATE tests SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        if($stmt->execute($params)){
            logActivity($conn, 1, "Updated Test", "test", $data->id, "Fields: " . implode(", ", array_keys($params)));
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Test updated."));
        } else {
            throw new Exception("Unable to update test.");
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
