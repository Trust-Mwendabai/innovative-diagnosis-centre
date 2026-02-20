<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    if (empty($_GET['patient_id'])) {
        throw new Exception("Patient ID is required.");
    }
    
    $patient_id = (int)$_GET['patient_id'];
    
    // Clear existing sample data for this patient to avoid duplicates during testing
    $conn->prepare("DELETE FROM health_metrics WHERE patient_id = :id")->execute([':id' => $patient_id]);
    
    $metrics_to_seed = [
        ['Blood Sugar', 5.4, 'mmol/L', '2023-10-01'],
        ['Blood Sugar', 5.8, 'mmol/L', '2023-11-15'],
        ['Blood Sugar', 5.2, 'mmol/L', '2023-12-20'],
        ['Blood Sugar', 5.5, 'mmol/L', '2024-01-10'],
        ['Blood Sugar', 5.1, 'mmol/L', '2024-02-05'],
        
        ['Cholesterol', 190, 'mg/dL', '2023-10-01'],
        ['Cholesterol', 185, 'mg/dL', '2023-12-20'],
        ['Cholesterol', 178, 'mg/dL', '2024-02-05'],
        
        ['Blood Pressure (Sys)', 130, 'mmHg', '2023-10-01'],
        ['Blood Pressure (Sys)', 128, 'mmHg', '2023-11-15'],
        ['Blood Pressure (Sys)', 125, 'mmHg', '2023-12-20'],
        ['Blood Pressure (Sys)', 122, 'mmHg', '2024-01-10'],
        ['Blood Pressure (Sys)', 118, 'mmHg', '2024-02-05'],
    ];
    
    $query = "INSERT INTO health_metrics (patient_id, metric_name, metric_value, unit, recorded_at) 
              VALUES (:patient_id, :name, :value, :unit, :date)";
    $stmt = $conn->prepare($query);
    
    foreach ($metrics_to_seed as $m) {
        $stmt->execute([
            ':patient_id' => $patient_id,
            ':name' => $m[0],
            ':value' => $m[1],
            ':unit' => $m[2],
            ':date' => $m[3]
        ]);
    }
    
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Sample health data seeded successfully."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Seeding failed: " . $e->getMessage()]);
}
?>
