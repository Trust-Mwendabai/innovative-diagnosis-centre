<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

try {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->role)) {
        throw new Exception("Missing required staff information.");
    }

    $query = "INSERT INTO staff (name, email, role, phone, branch_id) 
              VALUES (:name, :email, :role, :phone, :branch_id)";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':role', $data->role);
    $stmt->bindParam(':phone', $data->phone);
    $stmt->bindParam(':branch_id', $data->branch_id);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("success" => true, "message" => "Staff member created successfully."));
    } else {
        throw new Exception("Failed to create staff record.");
    }
} catch (Exception $e) {
    // Handle uniqueness constraint for email
    if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "A staff member with this email already exists."));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
}
?>
