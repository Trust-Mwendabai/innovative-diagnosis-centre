<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

// patient_id or appointment_id is required; doctor_id is optional (null/empty = unassign)
$hasTarget = !empty($data->patient_id) || !empty($data->appointment_id);

// Distinguish between assign and unassign
$isUnassign = !isset($data->doctor_id) || $data->doctor_id === '' || $data->doctor_id === null || $data->doctor_id === 0 || $data->doctor_id === 'unassign';

if ($hasTarget) {
    try {
        if (!empty($data->patient_id)) {
            if ($isUnassign) {
                // Remove doctor assignment from patient
                $query = "UPDATE patients SET doctor_id = NULL WHERE id = :patient_id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':patient_id', $data->patient_id);
            } else {
                $query = "UPDATE patients SET doctor_id = :doctor_id WHERE id = :patient_id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':doctor_id', $data->doctor_id);
                $stmt->bindParam(':patient_id', $data->patient_id);
            }
            $stmt->execute();
        }

        if (!empty($data->appointment_id)) {
            if ($isUnassign) {
                $query = "UPDATE appointments SET doctor_id = NULL WHERE id = :appointment_id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':appointment_id', $data->appointment_id);
            } else {
                $query = "UPDATE appointments SET doctor_id = :doctor_id WHERE id = :appointment_id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':doctor_id', $data->doctor_id);
                $stmt->bindParam(':appointment_id', $data->appointment_id);
            }
            $stmt->execute();
        }

        $action = $isUnassign ? "Doctor unassigned successfully." : "Doctor assigned successfully.";
        echo json_encode(["success" => true, "message" => $action]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data. Need patient_id or appointment_id."]);
}
?>
