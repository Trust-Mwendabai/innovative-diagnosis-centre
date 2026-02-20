<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    // Get monthly appointment trends (last 6 months)
    $query = "SELECT 
                DATE_FORMAT(date, '%b') as month,
                COUNT(*) as count
              FROM appointments 
              WHERE date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
              GROUP BY YEAR(date), MONTH(date)
              ORDER BY YEAR(date), MONTH(date)";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $trends = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get test distribution
    $query = "SELECT 
                t.name, 
                COUNT(*) as total
              FROM appointments a
              JOIN tests t ON a.test_id = t.id
              GROUP BY a.test_id
              ORDER BY total DESC
              LIMIT 5";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $testDist = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get revenue trends
    $query = "SELECT 
                DATE_FORMAT(date, '%b') as month,
                SUM(total_price) as revenue
              FROM appointments 
              WHERE date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
              GROUP BY YEAR(date), MONTH(date)
              ORDER BY YEAR(date), MONTH(date)";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $revenue = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "trends" => $trends,
        "distribution" => $testDist,
        "revenue" => $revenue
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error generating report data: " . $e->getMessage()
    ));
}
?>
