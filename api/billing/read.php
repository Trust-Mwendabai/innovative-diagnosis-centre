<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $patient_id = null;

    if (!empty($_GET['patient_id'])) {
        $patient_id = (int)$_GET['patient_id'];
    } else if (!empty($_GET['user_id'])) {
        $user_id = (int)$_GET['user_id'];
        $stmt = $conn->prepare("SELECT id FROM patients WHERE user_id = :user_id LIMIT 1");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($patient) {
            $patient_id = $patient['id'];
        }
    }

    if (!$patient_id) {
        throw new Exception("Patient record not found.");
    }
    
    // Fetch appointments with potential test/package info
    $query = "SELECT 
                a.id as invoice_no, 
                a.test_id, 
                a.total_price, 
                a.status, 
                a.date, 
                a.location_type,
                t.name as test_name,
                t.price as test_price,
                tp.name as package_name,
                tp.price as package_price
              FROM appointments a
              LEFT JOIN tests t ON a.test_id = t.id
              LEFT JOIN test_packages tp ON a.test_id = tp.id
              WHERE a.patient_id = :patient_id
              ORDER BY a.date DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':patient_id', $patient_id);
    $stmt->execute();
    
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $transactions = [];
    $totalSettled = 0;
    $pendingDues = 0;
    
    foreach ($appointments as $row) {
        $amount = 0;
        if (!empty($row['total_price']) && $row['total_price'] > 0) {
            $amount = (float)$row['total_price'];
        } else if (!empty($row['test_price'])) {
            $amount = (float)$row['test_price'];
        } else if (!empty($row['package_price'])) {
            $amount = (float)$row['package_price'];
        }
        
        $testName = $row['test_name'] ?: ($row['package_name'] ?: 'Diagnostic Test');
        
        $status = 'pending';
        if ($row['status'] === 'completed') {
            $status = 'paid';
        } else if ($row['status'] === 'cancelled') {
            $status = 'cancelled';
        }
        
        $transactions[] = [
            "id" => "INV-" . str_pad($row['invoice_no'], 6, "0", STR_PAD_LEFT),
            "test" => $testName,
            "amount" => $amount,
            "date" => $row['date'],
            "status" => $status,
            "method" => $row['location_type'] === 'home' ? 'Home Collection' : 'Lab Visit'
        ];
        
        if ($row['status'] === 'completed') {
            $totalSettled += $amount;
        } else if ($row['status'] === 'pending' || $row['status'] === 'confirmed') {
            $pendingDues += $amount;
        }
    }
    
    echo json_encode([
        "success" => true,
        "stats" => [
            "totalSettled" => $totalSettled,
            "pendingDues" => $pendingDues,
            "savedMethods" => 0 
        ],
        "transactions" => $transactions
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
