<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

try {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        throw new Exception("No data provided.");
    }

    // Convert data to JSON for storage in cms_content
    $settings_json = json_encode($data);

    // Check if system_settings exists
    $check_query = "SELECT id FROM cms_content WHERE section_name = 'system_settings' LIMIT 1";
    $stmt = $conn->prepare($check_query);
    $stmt->execute();
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        $query = "UPDATE cms_content SET content = :content WHERE section_name = 'system_settings'";
    } else {
        $query = "INSERT INTO cms_content (section_name, page_name, content) VALUES ('system_settings', 'admin_config', :content)";
    }

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':content', $settings_json);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Settings updated successfully."));
    } else {
        throw new Exception("Failed to update settings.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
