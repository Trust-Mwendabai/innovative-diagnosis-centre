<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->name) &&
    !empty($data->phone)
) {
    try {
        // Begin transaction
        $conn->beginTransaction();

        // 1. Check if patient already exists (by phone or email)
        $query = "SELECT id FROM patients WHERE phone = :phone OR (email = :email AND email != '')";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":phone", $data->phone);
        $email = !empty($data->email) ? $data->email : '';
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("success" => false, "message" => "Patient with this phone or email already exists."));
            $conn->rollBack();
            exit();
        }

        // 2. Insert into users table first (optional, but good for consistency if we want them to login)
        // For now, we'll just insert into patients directly as it seems to be the primary record for admin view
        // EDIT: The schema has user_id in patients table, so ideally we should create a user first.
        // Let's create a user record with role 'patient'
        
        $queryUser = "INSERT INTO users (name, email, phone, role, password) VALUES (:name, :email, :phone, 'patient', :password)";
        $stmtUser = $conn->prepare($queryUser);
        $stmtUser->bindParam(":name", $data->name);
        $stmtUser->bindParam(":email", $email); // Can be empty
        $stmtUser->bindParam(":phone", $data->phone);
        // Default password for manual creation (should be changed by user later via OTP or reset)
        $default_pass = password_hash("123456", PASSWORD_BCRYPT); 
        $stmtUser->bindParam(":password", $default_pass);
        
        if($stmtUser->execute()) {
            $user_id = $conn->lastInsertId();

            // 3. Insert into patients table
            $queryPatient = "INSERT INTO patients (user_id, name, email, phone, dob, gender, address) VALUES (:user_id, :name, :email, :phone, :dob, :gender, :address)";
            $stmtPatient = $conn->prepare($queryPatient);
            
            $stmtPatient->bindParam(":user_id", $user_id);
            $stmtPatient->bindParam(":name", $data->name);
            $stmtPatient->bindParam(":email", $email);
            $stmtPatient->bindParam(":phone", $data->phone);
            
            $dob = !empty($data->dob) ? $data->dob : null;
            $stmtPatient->bindParam(":dob", $dob);
            
            $gender = !empty($data->gender) ? $data->gender : 'other';
            $stmtPatient->bindParam(":gender", $gender);
            
            $address = !empty($data->address) ? $data->address : '';
            $stmtPatient->bindParam(":address", $address);

            if($stmtPatient->execute()) {
                $conn->commit();
                http_response_code(201);
                echo json_encode(array("success" => true, "message" => "Patient registered successfully."));
            } else {
                $conn->rollBack();
                http_response_code(503);
                echo json_encode(array("success" => false, "message" => "Unable to create patient record."));
            }
        } else {
            $conn->rollBack();
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Unable to create user account."));
        }
        
    } catch(PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Database Error: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data. Name and Phone are required."));
}
?>
