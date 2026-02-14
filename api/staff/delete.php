<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

try {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->id)) {
        throw new Exception("Missing staff ID.");
    }

    $query = "DELETE FROM staff WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Staff member removed successfully."));
    } else {
        throw new Exception("Failed to delete staff record.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
