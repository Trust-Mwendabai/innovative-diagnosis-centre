<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $query = "SELECT * FROM test_packages ORDER BY name ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // For each package, maybe fetch the test names if needed, 
    // but we'll handle the JSON decoding on the frontend for now.
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "packages" => $packages
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching packages: " . $e->getMessage()
    ));
}
?>
