<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Basic filter params
    $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    $action = isset($_GET['action']) ? $_GET['action'] : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;

    $query = "SELECT l.*, u.name as user_name, u.role as user_role 
              FROM audit_logs l
              LEFT JOIN users u ON l.user_id = u.id";
    
    $where = [];
    $params = [];

    if ($user_id) {
        $where[] = "l.user_id = :user_id";
        $params[':user_id'] = $user_id;
    }

    if ($action) {
        $where[] = "l.action = :action";
        $params[':action'] = $action;
    }

    if (!empty($where)) {
        $query .= " WHERE " . implode(" AND ", $where);
    }

    $query .= " ORDER BY l.created_at DESC LIMIT :limit";

    $stmt = $conn->prepare($query);
    
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    
    $stmt->execute();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON details for convenience
    foreach ($logs as &$log) {
        if ($log['details']) {
            $log['details'] = json_decode($log['details'], true);
        }
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "logs" => $logs
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Audit log retrieval failed: " . $e->getMessage()
    ]);
}
?>
