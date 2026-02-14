<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Mocking a database backup process
    $filename = "IDC_backup_" . date("Y-m-d_H-i-s") . ".sql";
    
    logActivity($conn, 1, "Database Backup", "system", 0, "Manual backup generated: $filename");
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true, 
        "message" => "Backup created successfully.",
        "filename" => $filename,
        "size" => "12.4 MB"
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
