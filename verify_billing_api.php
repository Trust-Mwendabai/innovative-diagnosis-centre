<?php
// Mock patient_id = 1
$patient_id = 1;

$url = "http://localhost/IDC/api/billing/read.php?patient_id=" . $patient_id;
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: " . $http_code . "\n";
echo "Response:\n";
$data = json_decode($response, true);
echo json_encode($data, JSON_PRETTY_PRINT);
?>
