<?php
include_once '../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Get total counts
    $query = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN DATE(date) = CURDATE() THEN 1 ELSE 0 END) as today,
                SUM(CASE WHEN date >= DATE(NOW()) - INTERVAL 7 DAY THEN 1 ELSE 0 END) as this_week,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
              FROM appointments";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get total registered patients
    $query = "SELECT COUNT(*) as registered_patients FROM patients";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $patients = $stmt->fetch(PDO::FETCH_ASSOC);
    $counts['patients'] = $patients['registered_patients'];

    // Get counts by date (last 7 days)
    $query = "SELECT date, COUNT(*) as count 
              FROM appointments 
              WHERE date >= DATE(NOW()) - INTERVAL 7 DAY 
              GROUP BY date 
              ORDER BY date ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $by_date = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get counts by location type
    $query = "SELECT location_type, COUNT(*) as count 
              FROM appointments 
              GROUP BY location_type";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $by_type = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "counts" => $counts,
        "trend" => $by_date,
        "distribution" => $by_type
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching statistics: " . $e->getMessage()
    ));
}
?>
