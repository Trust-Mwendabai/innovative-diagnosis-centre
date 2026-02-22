<?php
include_once 'api/config/database.php';

$output = "";

function logOut($msg) {
    global $output;
    $output .= $msg . "\n";
}

function dumpTable($conn, $tableName) {
    logOut("--- Table: $tableName ---");
    try {
        $stmt = $conn->prepare("DESCRIBE $tableName");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            logOut("{$col['Field']} - {$col['Type']} - {$col['Null']} - {$col['Key']}");
        }
        
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM $tableName");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        logOut("Total rows: {$row['count']}");
        
        if ($tableName === 'patients') {
            $stmt = $conn->prepare("SELECT id, name, doctor_id FROM $tableName");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            logOut("Data (Assigned Doctors):");
            foreach ($rows as $r) {
                logOut("ID: {$r['id']} - Name: {$r['name']} - DoctorID: " . ($r['doctor_id'] ?? 'NULL'));
            }
        }
        if ($tableName === 'appointments') {
            $stmt = $conn->prepare("SELECT id, patient_id, doctor_id, status FROM $tableName");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            logOut("Data (Appointments):");
            foreach ($rows as $r) {
                logOut("ID: {$r['id']} - PatientID: " . ($r['patient_id'] ?? 'NULL') . " - DoctorID: " . ($r['doctor_id'] ?? 'NULL') . " - Status: " . ($r['status'] ?? 'NULL'));
            }
        }
        if ($tableName === 'users') {
            $stmt = $conn->prepare("SELECT id, name, role FROM $tableName WHERE role = 'doctor'");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            logOut("Data (Doctors):");
            foreach ($rows as $r) {
                logOut("ID: {$r['id']} - Name: {$r['name']} - Role: {$r['role']}");
            }
        }
    } catch (Exception $e) {
        logOut("Error: " . $e->getMessage());
    }
    logOut("");
}

dumpTable($conn, 'users');
dumpTable($conn, 'patients');
dumpTable($conn, 'appointments');

file_put_contents('diag_output.txt', $output);
echo "Done. Check diag_output.txt";
?>
