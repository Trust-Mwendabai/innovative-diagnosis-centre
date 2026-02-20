<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $query = "SELECT * FROM cms_content WHERE section_name = 'system_settings'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If not exists, return defaults
    if (!$settings) {
        $settings = array(
            "content" => json_encode(array(
                "clinic_name" => "International Diagnostic Centre",
                "support_email" => "support@idc.co.zm",
                "sms_gateway" => "Twilio",
                "maintenance_mode" => false,
                "backup_frequency" => "Daily"
            ))
        );
    }
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "settings" => json_decode($settings['content'])
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
