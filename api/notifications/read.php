<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

// Simulate fetching user context (In a real app, this would come from the JWT/Session)
// For now, we'll allow passing user_id and role as query params or default to admin view
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
$role = isset($_GET['role']) ? $_GET['role'] : 'admin';

try {
    if ($role === 'admin') {
        // Admin sees all sent notifications (audit log)
        $query = "SELECT * FROM notifications ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
    } else {
        // Patients/Doctors see messages for their group OR specific to them
        $query = "SELECT * FROM notifications 
                  WHERE (recipient_group = :role AND recipient_id IS NULL) 
                  OR (recipient_group = 'individual' AND recipient_id = :user_id)
                  OR (recipient_group = 'all')
                  ORDER BY created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
    }

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array("success" => true, "notifications" => $notifications));
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}
?>
