<?php
/**
 * Global Activity Logger
 * Logs administrative actions to the database.
 */

function logActivity($conn, $userId, $action, $targetType = null, $targetId = null, $details = null) {
    try {
        $query = "INSERT INTO activity_logs (user_id, action, target_type, target_id, details) 
                  VALUES (:user_id, :action, :target_type, :target_id, :details)";
        
        $stmt = $conn->prepare($query);
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':action', $action);
        $stmt->bindParam(':target_type', $targetType);
        $stmt->bindParam(':target_id', $targetId);
        $stmt->bindParam(':details', $details);
        
        return $stmt->execute();
    } catch (PDOException $e) {
        // Silently fail or log to error log to avoid breaking main flow
        error_log("Logging Error: " . $e->getMessage());
        return false;
    }
}
?>
