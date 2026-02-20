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
        if(isset($data->address)) {
            $fields[] = "address = :address";
            $params[':address'] = htmlspecialchars(strip_tags($data->address));
        }
        if(isset($data->phone)) {
            $fields[] = "phone = :phone";
            $params[':phone'] = htmlspecialchars(strip_tags($data->phone));
        }
        if(isset($data->email)) {
            $fields[] = "email = :email";
            $params[':email'] = htmlspecialchars(strip_tags($data->email));
        }
        if(isset($data->opening_hours)) {
            $fields[] = "opening_hours = :opening_hours";
            $params[':opening_hours'] = htmlspecialchars(strip_tags($data->opening_hours));
        }
        
        if(empty($fields)) {
            throw new Exception("No fields to update.");
        }
        
        $query = "UPDATE branches SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        if($stmt->execute($params)){
            logActivity($conn, 1, "Updated Branch", "branch", $data->id, "Information modified.");
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Branch updated."));
        } else {
            throw new Exception("Unable to update branch.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Branch ID is required."));
}
?>
