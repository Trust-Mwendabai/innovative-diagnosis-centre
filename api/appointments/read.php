<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $query = "SELECT a.*, u.name as doctor_name 
              FROM appointments a 
              LEFT JOIN users u ON a.doctor_id = u.id 
              ORDER BY a.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $num = $stmt->rowCount();

    if($num > 0){
        $appointments_arr = array();
        $appointments_arr["success"] = true;
        $appointments_arr["appointments"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $appointment_item = array(
                "id" => $id,
                "name" => $name,
                "email" => $email,
                "phone" => $phone,
                "date" => $date,
                "time" => $time,
                "location_type" => $location_type,
                "branch_id" => $branch_id,
                "test_id" => $test_id,
                "doctor_id" => $doctor_id,
                "doctor_name" => $doctor_name,
                "total_price" => $total_price,
                "insurance_type" => $insurance_type,
                "insurance_provider" => $insurance_provider,
                "requires_fasting" => $requires_fasting,
                "fasting_confirmed" => $fasting_confirmed,
                "status" => $status,
                "created_at" => $created_at
            );
            array_push($appointments_arr["appointments"], $appointment_item);
        }
        http_response_code(200);
        echo json_encode($appointments_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "No appointments found."));
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Error: " . $e->getMessage()));
}
?>
