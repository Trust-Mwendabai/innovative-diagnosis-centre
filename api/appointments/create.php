<?php
include_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/audit_logger.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

$required_fields = ['name', 'phone', 'date', 'time', 'location_type'];
$missing = [];

foreach ($required_fields as $field) {
    if (empty($data->$field)) {
        // Special case: if it's name or phone, we might be able to get it from patient_id
        if (($field === 'name' || $field === 'phone') && !empty($data->patient_id)) {
            continue; 
        }
        $missing[] = $field;
    }
}

if(empty($missing)){
    try {
        // Auto-assign to "Least Busy" doctor
        $assign_query = "SELECT u.id 
                        FROM users u 
                        LEFT JOIN appointments a ON u.id = a.doctor_id AND DATE(a.date) = :today
                        WHERE u.role = 'doctor' 
                        GROUP BY u.id 
                        ORDER BY COUNT(a.id) ASC 
                        LIMIT 1";
        $assign_stmt = $conn->prepare($assign_query);
        $today = date('Y-m-d');
        $assign_stmt->bindParam(":today", $today);
        $assign_stmt->execute();
        $assigned_doctor = $assign_stmt->fetch(PDO::FETCH_ASSOC);
        
        $doctor_id = !empty($data->doctor_id) ? (int)$data->doctor_id : ($assigned_doctor ? $assigned_doctor['id'] : null);

        $query = "INSERT INTO appointments 
                    SET 
                    patient_id=:patient_id,
                    doctor_id=:doctor_id,
                    name=:name, 
                    email=:email, 
                    phone=:phone, 
                    date=:date, 
                    time=:time, 
                    location_type=:location_type, 
                    is_home_collection=:is_home_collection,
                    branch_id=:branch_id, 
                    test_id=:test_id, 
                    total_price=:total_price,
                    insurance_type=:insurance_type,
                    insurance_provider=:insurance_provider,
                    requires_fasting=:requires_fasting,
                    fasting_confirmed=:fasting_confirmed,
                    status='pending', 
                    created_at=:created_at";

        $stmt = $conn->prepare($query);

        // Sanitize
        $patient_id = isset($data->patient_id) ? (int)$data->patient_id : null;
        $name = !empty($data->name) ? htmlspecialchars(strip_tags($data->name)) : "";
        $phone = !empty($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : "";

        // Fallback for name/phone if patient_id is present
        if ($patient_id && (empty($name) || empty($phone))) {
            $p_stmt = $conn->prepare("SELECT name, phone FROM patients WHERE id = :id");
            $p_stmt->bindParam(":id", $patient_id);
            $p_stmt->execute();
            $p_row = $p_stmt->fetch(PDO::FETCH_ASSOC);
            if ($p_row) {
                if (empty($name)) $name = $p_row['name'];
                if (empty($phone)) $phone = $p_row['phone'];
            }
        }

        $email = !empty($data->email) ? htmlspecialchars(strip_tags($data->email)) : "";
        $date = htmlspecialchars(strip_tags($data->date));
        $time = htmlspecialchars(strip_tags($data->time));
        $location_type = htmlspecialchars(strip_tags($data->location_type));
        $is_home_collection = ($location_type === 'home') ? 1 : 0;
        $branch_id = !empty($data->branch_id) ? (int)$data->branch_id : null;
        $test_id = !empty($data->test_id) ? (int)$data->test_id : null;
        $total_price = !empty($data->total_price) ? (float)$data->total_price : 0;
        $insurance_type = !empty($data->insurance_type) ? htmlspecialchars(strip_tags($data->insurance_type)) : 'cash';
        $insurance_provider = !empty($data->insurance_provider) ? htmlspecialchars(strip_tags($data->insurance_provider)) : null;
        $requires_fasting = !empty($data->requires_fasting) ? (int)$data->requires_fasting : 0;
        $fasting_confirmed = !empty($data->fasting_confirmed) ? (int)$data->fasting_confirmed : 0;
        $created_at=date('Y-m-d H:i:s');

        // Bind
        $stmt->bindParam(":patient_id", $patient_id);
        $stmt->bindParam(":doctor_id", $doctor_id);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":phone", $phone);
        $stmt->bindParam(":date", $date);
        $stmt->bindParam(":time", $time);
        $stmt->bindParam(":location_type", $location_type);
        $stmt->bindParam(":is_home_collection", $is_home_collection);
        $stmt->bindParam(":branch_id", $branch_id);
        $stmt->bindParam(":test_id", $test_id);
        $stmt->bindParam(":total_price", $total_price);
        $stmt->bindParam(":insurance_type", $insurance_type);
        $stmt->bindParam(":insurance_provider", $insurance_provider);
        $stmt->bindParam(":requires_fasting", $requires_fasting);
        $stmt->bindParam(":fasting_confirmed", $fasting_confirmed);
        $stmt->bindParam(":created_at", $created_at);

        if($stmt->execute()){
            $appointment_id = $conn->lastInsertId();
            
            // Log the creation of a new medical appointment
            logAudit("CREATE_APPOINTMENT", "appointment", $appointment_id, [
                "patient_name" => $name,
                "test_id" => $test_id,
                "date" => $date,
                "doctor_id" => $doctor_id
            ]);

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
    echo json_encode(array("success" => false, "message" => "Incomplete data. Missing: " . implode(', ', $missing)));
}
?>
