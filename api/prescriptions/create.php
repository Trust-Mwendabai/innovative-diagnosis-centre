<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->patient_id) && !empty($data->medication) && !empty($data->dosage)){
    try {
        $query = "INSERT INTO prescriptions 
                  SET patient_id = :patient_id, 
                      doctor_id = :doctor_id, 
                      medication = :medication, 
                      dosage = :dosage, 
                      instructions = :instructions, 
                      status = 'active'";
        
        $stmt = $conn->prepare($query);
        
        $patient_id = htmlspecialchars(strip_tags($data->patient_id));
        $doctor_id = htmlspecialchars(strip_tags($data->doctor_id ?? 1));
        $medication = htmlspecialchars(strip_tags($data->medication));
        $dosage = htmlspecialchars(strip_tags($data->dosage));
        $instructions = htmlspecialchars(strip_tags($data->instructions ?? ''));
        
        $stmt->bindParam(':patient_id', $patient_id);
        $stmt->bindParam(':doctor_id', $doctor_id);
        $stmt->bindParam(':medication', $medication);
        $stmt->bindParam(':dosage', $dosage);
        $stmt->bindParam(':instructions', $instructions);
        
        if($stmt->execute()){
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Prescription created."));
        } else {
            throw new Exception("Unable to create prescription.");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. Patient ID, medication and dosage required."));
}
?>
