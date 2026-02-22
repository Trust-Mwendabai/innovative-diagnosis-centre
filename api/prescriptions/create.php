<?php
include_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/audit_logger.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->patient_id) &&
    !empty($data->doctor_id) &&
    !empty($data->medication) &&
    !empty($data->dosage)
) {
    try {
        $query = "INSERT INTO prescriptions 
                  SET 
                    patient_id = :patient_id,
                    doctor_id = :doctor_id,
                    medication = :medication,
                    dosage = :dosage,
                    instructions = :instructions,
                    date_prescribed = :date_prescribed,
                    status = 'active'";

        $stmt = $conn->prepare($query);

        $date_prescribed = !empty($data->date_prescribed) ? $data->date_prescribed : date('Y-m-d');

        $stmt->bindParam(':patient_id', $data->patient_id);
        $stmt->bindParam(':doctor_id', $data->doctor_id);
        $stmt->bindParam(':medication', $data->medication);
        $stmt->bindParam(':dosage', $data->dosage);
        $stmt->bindParam(':instructions', $data->instructions);
        $stmt->bindParam(':date_prescribed', $date_prescribed);

        if($stmt->execute()){
            $prescription_id = $conn->lastInsertId();
            
            // Log clinical event
            logAudit("CREATE_PRESCRIPTION", "prescription", $prescription_id, [
                "patient_id" => $data->patient_id,
                "medication" => $data->medication
            ]);

            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Prescription generated successfully."));
        } else {
            throw new Exception("Execution failed.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete prescription data."));
}
?>
