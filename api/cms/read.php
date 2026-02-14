<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $section = isset($_GET['section']) ? $_GET['section'] : null;
    
    $query = "SELECT * FROM cms_content";
    if ($section) {
        $query .= " WHERE section_name = :section";
    }
    
    $stmt = $conn->prepare($query);
    if ($section) {
        $stmt->bindParam(':section', $section);
    }
    $stmt->execute();
    
    $content = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "content" => $content
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching CMS content: " . $e->getMessage()
    ));
}
?>
