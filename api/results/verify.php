<?php
include_once '../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->status)){
    try {
        $id = (int)$data->id;
        $status = htmlspecialchars(strip_tags($data->status)); // 'verified' or 'rejected'
        $admin_id = 1;
        $comments = htmlspecialchars(strip_tags($data->comments ?? ''));

        $query = "UPDATE test_results 
                  SET status = :status, verified_by = :verified_by, verified_at = CURRENT_TIMESTAMP, comments = :comments 
                  WHERE id = :id";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':verified_by', $admin_id);
        $stmt->bindParam(':comments', $comments);
        $stmt->bindParam(':id', $id);

        if($stmt->execute()){
            // If verified, update the appointment to 'completed'
            if ($status === 'verified') {
                $checkQuery = "SELECT appointment_id FROM test_results WHERE id = :id";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->bindParam(':id', $id);
                $checkStmt->execute();
                $res = $checkStmt->fetch(PDO::FETCH_ASSOC);
                
                if ($res) {
                    $updateApp = "UPDATE appointments SET status = 'completed' WHERE id = :app_id";
                    $upStmt = $conn->prepare($updateApp);
                    $upStmt->bindParam(':app_id', $res['appointment_id']);
                    $upStmt->execute();
                    
                    logActivity($conn, $admin_id, "Verified Result", "appointment", $res['appointment_id'], "Status: $status");
                }
            }

            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Result status updated to $status."));
        } else {
            throw new Exception("Unable to verify result.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. ID and status required."));
}
?>
