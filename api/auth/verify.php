<?php
include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->identifier) && !empty($data->otp)) {
    try {
        $identifier = htmlspecialchars(strip_tags($data->identifier));
        $otp = htmlspecialchars(strip_tags($data->otp));

        $query = "SELECT id, name, email, role FROM users 
                  WHERE (email = :id OR phone = :id) 
                  AND otp_code = :otp 
                  AND otp_expiry > NOW() 
                  LIMIT 1";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $identifier);
        $stmt->bindParam(':otp', $otp);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Clear OTP
            $clear = "UPDATE users SET otp_code = NULL, otp_expiry = NULL WHERE id = :id";
            $cl_stmt = $conn->prepare($clear);
            $cl_stmt->bindParam(':id', $user['id']);
            $cl_stmt->execute();

            // Return user data and a mock token
            echo json_encode([
                "success" => true,
                "token" => "mock-jwt-token-" . bin2hex(random_bytes(16)),
                "user" => [
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid or expired OTP."]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Identifier and OTP required."]);
}
?>
