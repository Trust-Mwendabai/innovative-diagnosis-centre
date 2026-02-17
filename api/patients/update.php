<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->name)){
    try {
        $query = "UPDATE patients 
                  SET 
                    name = :name,
                    email = :email,
                    phone = :phone,
                    address = :address,
                    dob = :dob,
                    gender = :gender
                  WHERE id = :id";

        $stmt = $conn->prepare($query);

        // Sanitize
        $id = (int)$data->id;
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $phone = htmlspecialchars(strip_tags($data->phone));
        $address = htmlspecialchars(strip_tags($data->address));
        $dob = !empty($data->dob) ? htmlspecialchars(strip_tags($data->dob)) : null;
        $gender = !empty($data->gender) ? htmlspecialchars(strip_tags($data->gender)) : null;

        // Bind
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':gender', $gender);

        if($stmt->execute()){
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Profile updated successfully."));
        } else {
            throw new Exception("Unable to update profile.");
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
