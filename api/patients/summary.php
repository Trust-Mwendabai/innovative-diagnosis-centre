<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if (empty($_GET['id'])) {
        throw new Exception("Patient ID is required.");
    }
    
    $id = (int)$_GET['id'];
    
    // 1. Get stats counts and health overview efficiently
    $stats_query = "SELECT 
        (SELECT COUNT(*) FROM appointments WHERE patient_id = :id AND status = 'pending') as pending,
        (SELECT COUNT(*) FROM appointments WHERE patient_id = :id AND status = 'completed') as completed,
        (SELECT COUNT(*) FROM test_results WHERE patient_id = :id) as results,
        name, blood_group, weight, height
        FROM patients WHERE id = :id";
    
    $stmt = $conn->prepare($stats_query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $patient_data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // 2. Get latest health metrics
    $metrics_query = "SELECT metric_name, metric_value, unit, recorded_at 
                      FROM health_metrics 
                      WHERE patient_id = :id 
                      AND (metric_name, recorded_at) IN (
                          SELECT metric_name, MAX(recorded_at) 
                          FROM health_metrics 
                          WHERE patient_id = :id 
                          GROUP BY metric_name
                      )";
    $stmt = $conn->prepare($metrics_query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $latest_metrics = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Get only recent bookings (limit to 3)
    $bookings_query = "SELECT a.*, s.name as staff_name, b.name as branch_name 
                      FROM appointments a
                      LEFT JOIN staff s ON a.staff_id = s.id
                      LEFT JOIN branches b ON a.branch_id = b.id
                      WHERE a.patient_id = :id
                      ORDER BY a.date DESC, a.time DESC
                      LIMIT 3";
    
    $stmt = $conn->prepare($bookings_query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $recent_bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "patient" => array(
            "name" => $patient_data['name'],
            "blood_group" => $patient_data['blood_group'],
            "weight" => $patient_data['weight'],
            "height" => $patient_data['height']
        ),
        "stats" => array(
            "pending" => (int)$patient_data['pending'],
            "completed" => (int)$patient_data['completed'],
            "results" => (int)$patient_data['results']
        ),
        "latest_metrics" => $latest_metrics,
        "recent_bookings" => $recent_bookings
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching summary: " . $e->getMessage()
    ));
}
?>
