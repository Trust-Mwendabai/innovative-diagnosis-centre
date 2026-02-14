<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$data = json_decode(file_get_contents("php://input"));

// Map 'email' from frontend to 'identifier' for backend processing
$identifier = !empty($data->identifier) ? $data->identifier : (!empty($data->email) ? $data->email : null);

if(!empty($identifier)) {
    try {
        $identifier = htmlspecialchars(strip_tags($identifier));
        $password = !empty($data->password) ? $data->password : null;
        
        // Find user by email or phone
        $query = "SELECT id, name, email, phone, password, role FROM users WHERE email = :id OR phone = :id LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $identifier);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $user_id = $row['id'];
            
            // Scenario A: Password provided (Direct authentication)
            if ($password) {
                if (password_verify($password, $row['password'])) {
                    // Success: Return user data and mock token (similar to verify.php)
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "token" => "mock-jwt-token-" . bin2hex(random_bytes(16)),
                        "user" => [
                            "name" => $row['name'],
                            "email" => $row['email'],
                            "role" => $row['role']
                        ]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(["success" => false, "message" => "Invalid credentials."]);
                }
            } 
            // Scenario B: No password (OTP flow for patients)
            else {
                // Generate OTP (simulated)
                $otp = "123456"; 
                $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

                $update = "UPDATE users SET otp_code = :otp, otp_expiry = :expiry WHERE id = :user_id";
                $up_stmt = $conn->prepare($update);
                $up_stmt->bindParam(':otp', $otp);
                $up_stmt->bindParam(':expiry', $expiry);
                $up_stmt->bindParam(':user_id', $user_id);

                if($up_stmt->execute()) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true, 
                        "message" => "OTP sent to your registered contact.",
                        "otp_simulated" => $otp 
                    ]);
                } else {
                    throw new Exception("Failed to generate OTP.");
                }
            }
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Account not found."]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Infrastructure error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Identifier (email or phone) is required."]);
}
?>
