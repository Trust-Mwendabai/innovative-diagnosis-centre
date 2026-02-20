<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->current_password) || !isset($data->new_password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

try {
    // 1. Verify current password
    $query = "SELECT password FROM users WHERE id = :id LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->user_id);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!password_verify($data->current_password, $row['password'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Incorrect current password."]);
        exit;
    }

    // 2. Update to new password
    $new_password_hash = password_hash($data->new_password, PASSWORD_BCRYPT);
    $updateQuery = "UPDATE users SET password = :password WHERE id = :id";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bindParam(':password', $new_password_hash);
    $updateStmt->bindParam(':id', $data->user_id);

    if ($updateStmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Password updated successfully."]);
    } else {
        throw new Exception("Failed to update password.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
