<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    
    $query = "SELECT * FROM tests";
    $conditions = [];
    $params = [];
    
    if ($category) {
        $conditions[] = "category = :category";
        $params[':category'] = $category;
    }
    
    if ($search) {
        $conditions[] = "(name LIKE :search OR description LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    $query .= " ORDER BY name ASC";
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    
    $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "tests" => $tests
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching tests: " . $e->getMessage()
    ));
}
?>
