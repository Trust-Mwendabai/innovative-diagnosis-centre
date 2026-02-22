<?php
require_once __DIR__ . '/../config/database.php';

class AuditLogger {
    private $db;

    public function __construct() {
        global $conn;
        if (!isset($conn)) {
            require_once __DIR__ . '/../config/database.php';
        }
        $this->db = $conn;
    }

    /**
     * Log a clinical or administrative action.
     * 
     * @param string $action The action performed (e.g. VIEW_PATIENT)
     * @param string|null $targetType The type of resource (e.g. patient, report)
     * @param int|null $targetId The ID of the resource
     * @param array|null $details Extra context as an associative array
     * @return bool
     */
    public function log($action, $targetType = null, $targetId = null, $details = null) {
        // Try to get user_id from various sources (session, auth header, etc)
        $userId = $this->getUserId();
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $detailsJson = $details ? json_encode($details) : null;

        try {
            $stmt = $this->db->prepare("INSERT INTO audit_logs 
                (user_id, action, target_type, target_id, details, ip_address) 
                VALUES (?, ?, ?, ?, ?, ?)");
            
            return $stmt->execute([$userId, $action, $targetType, $targetId, $detailsJson, $ip]);
        } catch (PDOException $e) {
            error_log("Audit Logging Failed: " . $e->getMessage());
            return false;
        }
    }

    private function getUserId() {
        // Check session first
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (isset($_SESSION['user_id'])) {
            return $_SESSION['user_id'];
        }

        // Check for Bearer token or other auth (implement as needed based on app auth)
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            // This is a placeholder - usually you'd decode JWT or check token
            // For now, if we have a custom header for testing/integration
            if (preg_match('/Bearer\s(\d+)/', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }

        return null;
    }
}

// Global helper function for convenience
function logAudit($action, $targetType = null, $targetId = null, $details = null) {
    static $logger = null;
    if ($logger === null) {
        $logger = new AuditLogger();
    }
    return $logger->log($action, $targetType, $targetId, $details);
}
?>
