<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name)){
    try {
        $query = "INSERT INTO branches (name, address, phone, email, opening_hours) 
                  VALUES (:name, :address, :phone, :email, :opening_hours)";
        
        $stmt = $conn->prepare($query);
        
        $name = htmlspecialchars(strip_tags($data->name));
        $address = htmlspecialchars(strip_tags($data->address ?? ''));
        $phone = htmlspecialchars(strip_tags($data->phone ?? ''));
        $email = htmlspecialchars(strip_tags($data->email ?? ''));
        $opening_hours = htmlspecialchars(strip_tags($data->opening_hours ?? ''));
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':opening_hours', $opening_hours);
        
        if($stmt->execute()){
            $newId = $conn->lastInsertId();
            logActivity($conn, 1, "Created Branch", "branch", $newId, "Name: $name");
            
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Branch created.", "id" => $newId));
        } else {
            throw new Exception("Unable to create branch.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Branch name is required."));
}
?>
