-- Health Metrics Tracking Table
CREATE TABLE IF NOT EXISTS `health_metrics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `metric_name` VARCHAR(100) NOT NULL, -- e.g., 'Blood Sugar', 'Cholesterol', 'Blood Pressure (Sys)', 'Blood Pressure (Dia)'
    `metric_value` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(20), -- e.g., 'mmol/L', 'mg/dL', 'mmHg'
    `recorded_at` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
