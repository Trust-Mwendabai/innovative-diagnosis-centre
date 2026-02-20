<?php
/**
 * IDC Health Intelligence Seeding Node
 * Populates biometric history for all existing patients in the ecosystem.
 */
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // 1. Get all patients
    $stmt = $conn->query("SELECT id FROM patients");
    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($patients)) {
        echo json_encode(["success" => false, "message" => "No patients found in the registry."]);
        exit;
    }

    $metrics_template = [
        ['Blood Sugar', 5.0, 6.5, 'mmol/L'],
        ['Cholesterol', 170, 200, 'mg/dL'],
        ['Blood Pressure (Sys)', 115, 135, 'mmHg'],
        ['Blood Pressure (Dia)', 75, 85, 'mmHg'],
    ];

    $insert_query = "INSERT INTO health_metrics (patient_id, metric_name, metric_value, unit, recorded_at) 
                    VALUES (:patient_id, :name, :value, :unit, :date)";
    $insert_stmt = $conn->prepare($insert_query);

    $records_count = 0;
    
    // Clear existing trace data to prevent bloat
    $conn->exec("TRUNCATE TABLE health_metrics");

    foreach ($patients as $p) {
        $pid = $p['id'];
        
        // Generate 5-8 random data points for each metric over the last 6 months
        foreach ($metrics_template as $m) {
            $name = $m[0];
            $min = $m[1];
            $max = $m[2];
            $unit = $m[3];
            
            for ($i = 0; $i < 6; $i++) {
                $value = $min + (mt_rand() / mt_getrandmax()) * ($max - $min);
                $date = date('Y-m-d', strtotime("-$i months -" . rand(0, 28) . " days"));
                
                $insert_stmt->execute([
                    ':patient_id' => $pid,
                    ':name' => $name,
                    ':value' => round($value, 2),
                    ':unit' => $unit,
                    ':date' => $date
                ]);
                $records_count++;
            }
        }
    }

    http_response_code(201);
    echo json_encode([
        "success" => true, 
        "message" => "Global health data sync completed.", 
        "records_integrated" => $records_count,
        "patients_affected" => count($patients)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Global seeding failed: " . $e->getMessage()]);
}
?>
