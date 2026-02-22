<?php
include_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/audit_logger.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->status)) {
    try {
        $query = "UPDATE prescriptions SET status = :status WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);

        if($stmt->execute()){
            logAudit("UPDATE_PRESCRIPTION_STATUS", "prescription", $data->id, ["new_status" => $data->status]);
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Prescription status updated."));
        } else {
            throw new Exception("Update failed.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
