<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $query = "SELECT * FROM branches ORDER BY name ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $branches = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "branches" => $branches
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching branches: " . $e->getMessage()
    ));
}
?>
