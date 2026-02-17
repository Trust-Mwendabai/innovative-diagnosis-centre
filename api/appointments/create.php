<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->name) &&
    !empty($data->phone) &&
    !empty($data->date) &&
    !empty($data->location_type)
){
    try {
        $query = "INSERT INTO appointments 
                    SET 
                    patient_id=:patient_id,
                    name=:name, 
                    email=:email, 
                    phone=:phone, 
                    date=:date, 
                    time=:time, 
                    location_type=:location_type, 
                    branch_id=:branch_id, 
                    test_id=:test_id, 
                    status='pending', 
                    created_at=:created_at";

        $stmt = $conn->prepare($query);

        // Sanitize
        $patient_id = isset($data->patient_id) ? (int)$data->patient_id : null;
        $name=htmlspecialchars(strip_tags($data->name));
        $email=htmlspecialchars(strip_tags($data->email));
        $phone=htmlspecialchars(strip_tags($data->phone));
        $date=htmlspecialchars(strip_tags($data->date));
        $time=htmlspecialchars(strip_tags($data->time));
        $location_type=htmlspecialchars(strip_tags($data->location_type));
        $branch_id = !empty($data->branch_id) ? (int)$data->branch_id : null;
        $test_id = !empty($data->test_id) ? (int)$data->test_id : null;
        $created_at=date('Y-m-d H:i:s');

        // Bind
        $stmt->bindParam(":patient_id", $patient_id);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":date", $date);
        $stmt->bindParam(":time", $time);
        $stmt->bindParam(":location_type", $location_type);
        $stmt->bindParam(":branch_id", $branch_id);
        $stmt->bindParam(":test_id", $test_id);
        $stmt->bindParam(":created_at", $created_at);

        if($stmt->execute()){
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Appointment created successfully."));
        } else{
            throw new Exception("Unable to create appointment.");
        }
    } catch(Exception $e) {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
