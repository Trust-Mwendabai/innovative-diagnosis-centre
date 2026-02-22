<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $date = isset($_GET['date']) ? $_GET['date'] : null;
    $branch_id = isset($_GET['branch_id']) ? $_GET['branch_id'] : null;
    $location_type = isset($_GET['location_type']) ? $_GET['location_type'] : null;

    if (!$date) {
        throw new Exception("Date is required.");
    }

    $query = "SELECT time FROM appointments WHERE date = :date AND status IN ('pending', 'confirmed')";
    $params = [':date' => $date];

    if ($location_type === 'home') {
        $query .= " AND location_type = 'home'";
    } elseif ($branch_id) {
        $query .= " AND branch_id = :branch_id";
        $params[':branch_id'] = $branch_id;
    }

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $booked_slots = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        "success" => true,
        "booked_slots" => $booked_slots
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
