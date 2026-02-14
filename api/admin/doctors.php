<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch all doctors
        $query = "SELECT id, name, email, phone, role, created_at FROM users WHERE role = 'doctor' ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "doctors" => $doctors]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->name) && !empty($data->email)) {
            // Check if user exists
            $check = "SELECT id FROM users WHERE email = :email LIMIT 1";
            $c_stmt = $conn->prepare($check);
            $c_stmt->bindParam(':email', $data->email);
            $c_stmt->execute();

            if ($c_stmt->rowCount() > 0) {
                echo json_encode(["success" => false, "message" => "Email already registered."]);
                exit;
            }

            // Create doctor user
            $query = "INSERT INTO users (name, email, phone, role, password) VALUES (:name, :email, :phone, 'doctor', :password)";
            $stmt = $conn->prepare($query);
            
            $password = !empty($data->password) ? password_hash($data->password, PASSWORD_DEFAULT) : password_hash("doctor123", PASSWORD_DEFAULT);
            $phone = !empty($data->phone) ? $data->phone : null;

            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':email', $data->email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':password', $password);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Doctor created successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to create doctor."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Incomplete data."]);
        }
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $query = "DELETE FROM users WHERE id = :id AND role = 'doctor'";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Doctor removed."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to remove doctor."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "ID required."]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
