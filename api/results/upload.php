<?php
include_once __DIR__ . '/../config/database.php';
include_once '../utils/logger.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!isset($_FILES['report']) || !isset($_POST['appointment_id']) || !isset($_POST['patient_id'])) {
            throw new Exception("Incomplete data.");
        }

        $appointment_id = (int)$_POST['appointment_id'];
        $patient_id = (int)$_POST['patient_id'];
        $technician_id = 1; // Default to admin/technician level 1 for now

        $file = $_FILES['report'];
        $fileName = time() . '_' . basename($file['name']);
        $targetPath = "../uploads/results/" . $fileName;

        $fileType = strtolower(pathinfo($targetPath, PATHINFO_EXTENSION));
        if ($fileType != "pdf" && $fileType != "jpg" && $fileType != "png") {
            throw new Exception("Only PDF, JPG, & PNG files are allowed.");
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $query = "INSERT INTO test_results (appointment_id, patient_id, result_pdf, technician_id, status) 
                      VALUES (:appointment_id, :patient_id, :result_pdf, :technician_id, 'pending')";
            
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':appointment_id', $appointment_id);
            $stmt->bindParam(':patient_id', $patient_id);
            $stmt->bindParam(':result_pdf', $fileName);
            $stmt->bindParam(':technician_id', $technician_id);

            if ($stmt->execute()) {
                // Update appointment status to completed (or waiting for verification)
                // Actually, let's keep it 'confirmed' or 'pending' until verified? 
                // Or maybe 'completed' means results are uploaded.
                
                logActivity($conn, $technician_id, "Uploaded Result", "appointment", $appointment_id, "File: $fileName");
                
                http_response_code(201);
                echo json_encode(array("success" => true, "message" => "Result uploaded successfully.", "file" => $fileName));
            } else {
                unlink($targetPath); // Remove file if DB fail
                throw new Exception("Unable to save result record.");
            }
        } else {
            throw new Exception("Failed to move uploaded file.");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $e->getMessage()));
    }
}
?>
