<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if (empty($_GET['patient_id'])) {
        throw new Exception("Patient ID is required.");
    }
    
    $patient_id = (int)$_GET['patient_id'];
    
    $query = "SELECT * FROM health_metrics 
              WHERE patient_id = :patient_id 
              ORDER BY recorded_at ASC";
              
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':patient_id', $patient_id);
    $stmt->execute();
    
    $metrics = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group metrics by name for easier frontend consumption
    $grouped = [];
    foreach ($metrics as $m) {
        $name = $m['metric_name'];
        if (!isset($grouped[$name])) {
            $grouped[$name] = [
                "name" => $name,
                "unit" => $m['unit'],
                "data" => []
            ];
        }
        $grouped[$name]['data'][] = [
            "date" => $m['recorded_at'],
            "value" => (float)$m['metric_value']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "metrics" => array_values($grouped)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error fetching health metrics: " . $e->getMessage()
    ]);
}
?>
