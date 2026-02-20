<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)){
    try {
        $fields = [];
        $params = [':id' => htmlspecialchars(strip_tags($data->id))];
        $action = "Updated Appointment";
        $details = "ID: " . $data->id;

        if(!empty($data->status)) {
            $fields[] = "status = :status";
            $params[':status'] = htmlspecialchars(strip_tags($data->status));
            $action = "Status Changed";
            $details .= " to " . $data->status;
        }

        if(!empty($data->date)) {
            $fields[] = "date = :date";
            $params[':date'] = htmlspecialchars(strip_tags($data->date));
            $action = "Appointment Rescheduled";
            $details .= " to " . $data->date;
        }

        if(!empty($data->time)) {
            $fields[] = "time = :time";
            $params[':time'] = htmlspecialchars(strip_tags($data->time));
        }

        if(!empty($data->staff_id)) {
            $fields[] = "staff_id = :staff_id";
            $params[':staff_id'] = (int)$data->staff_id;
            $action = "Staff Assigned";
            $details .= " Staff ID: " . $data->staff_id;
        }

        if(!empty($data->branch_id)) {
            $fields[] = "branch_id = :branch_id";
            $params[':branch_id'] = (int)$data->branch_id;
        }

        if(empty($fields)) {
            throw new Exception("No fields to update.");
        }

        $query = "UPDATE appointments SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $conn->prepare($query);

        if($stmt->execute($params)){
            // Log the activity
            logActivity($conn, 1, $action, 'appointment', $data->id, $details); // Hardcoded 1 for admin for now
            
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Appointment updated."));
        } else{
            throw new Exception("Unable to update appointment.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Missing appointment ID."));
}
?>
