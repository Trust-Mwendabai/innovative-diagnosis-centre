<?php
include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && (!empty($data->email) || !empty($data->phone)) && !empty($data->password)) {
    try {
        $conn->beginTransaction();

        // 1. Create User
        $query = "INSERT INTO users (name, email, phone, role, password) VALUES (:name, :email, :phone, 'patient', :password)";
        $stmt = $conn->prepare($query);

        $name = htmlspecialchars(strip_tags($data->name));
        $email = !empty($data->email) ? htmlspecialchars(strip_tags($data->email)) : null;
        $phone = htmlspecialchars(strip_tags($data->phone));
        $password = password_hash($data->password, PASSWORD_DEFAULT);

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':password', $password);

        if($stmt->execute()) {
            $user_id = $conn->lastInsertId();

            // 2. Create Patient Profile
            $query = "INSERT INTO patients (user_id, name, email, phone) VALUES (:user_id, :name, :email, :phone)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            
            if($stmt->execute()) {
                $conn->commit();
                http_response_code(201);
                echo json_encode(["success" => true, "message" => "User registered successfully."]);
            } else {
                throw new Exception("Unable to create patient profile.");
            }
        } else {
            throw new Exception("Unable to register user.");
        }
    } catch(Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>
