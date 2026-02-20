<?php
/**
 * IDC Data Integrity Node
 * Reconciles orphaned data and populates core catalogs.
 */
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['SERVER_ADDR'] = '127.0.0.1';
include_once __DIR__ . '/api/config/database.php';

try {
    echo "--- 1. Populating Tests Table ---\n";
    $tests = [
        ['mens', 'Comprehensive Mens Health Panel', 'Full diagnostic suite for mens vitality and endocrine health.', 250.00, '48h'],
        ['full_blood', 'Full Blood Count (FBC)', 'Basic screening test for anemia, infection and blood health.', 45.00, '24h'],
        ['diabetes', 'Diabetes Screening (HbA1c)', 'Measures your average blood sugar levels over the past 3 months.', 85.00, '24h'],
        ['liver', 'Liver Function Profile', 'Evaluates enzymes and proteins for hepatic assessment.', 110.00, '48h'],
        ['kidney', 'Kidney Function Test', 'Diagnostic assessment of urea, creatinine and electrolytes.', 95.00, '24h']
    ];

    $check_tests = $conn->query("SELECT COUNT(*) FROM tests")->fetchColumn();
    if ($check_tests == 0) {
        $stmt = $conn->prepare("INSERT INTO tests (id, name, description, price, turnaround_time) VALUES (?, ?, ?, ?, ?)");
        foreach ($tests as $t) {
            $stmt->execute($t);
        }
        echo "Tests populated successfully.\n";
    } else {
        echo "Tests table already has data.\n";
    }

    echo "\n--- 2. Reconciling Orphaned Appointments ---\n";
    // Find appointments where patient_id is NULL but email/phone matches an existing patient
    $stmt = $conn->query("SELECT id, email, phone FROM appointments WHERE patient_id IS NULL OR patient_id = 0");
    $orphans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $link_stmt = $conn->prepare("UPDATE appointments SET patient_id = :pid WHERE id = :aid");
    $find_patient = $conn->prepare("SELECT id FROM patients WHERE email = :email OR phone = :phone LIMIT 1");
    
    $linked_count = 0;
    foreach ($orphans as $o) {
        $find_patient->execute([':email' => $o['email'], ':phone' => $o['phone']]);
        $pid = $find_patient->fetchColumn();
        
        if ($pid) {
            $link_stmt->execute([':pid' => $pid, ':aid' => $o['id']]);
            $linked_count++;
        }
    }
    echo "Reconciled $linked_count orphaned appointments.\n";

} catch (Exception $e) {
    echo "INTEGRITY ERROR: " . $e->getMessage() . "\n";
}
?>
