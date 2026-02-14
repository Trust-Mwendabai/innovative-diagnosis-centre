-- Migration Step 1: Alter appointments table to support normalization
ALTER TABLE `appointments` ADD COLUMN `patient_id` INT AFTER `id`;
ALTER TABLE `appointments` ADD COLUMN `test_ids` TEXT AFTER `test_id`; -- JSON array for multiple tests
ALTER TABLE `appointments` ADD COLUMN `total_price` DECIMAL(10, 2) AFTER `test_ids`;
ALTER TABLE `appointments` ADD COLUMN `is_home_collection` BOOLEAN DEFAULT FALSE AFTER `location_type`;
ALTER TABLE `appointments` ADD COLUMN `staff_id` INT AFTER `branch_id`;

-- Migration Step 2: Populate patients table from appointments
INSERT INTO `patients` (name, email, phone)
SELECT DISTINCT name, email, phone FROM `appointments`;

-- Migration Step 3: Link appointments to patients
UPDATE `appointments` a
JOIN `patients` p ON a.email = p.email OR (a.phone = p.phone AND a.email IS NULL)
SET a.patient_id = p.id;

-- Migration Step 4: Cleanup (Optional/Later)
-- We'll keep name, email, phone in appointments for now to avoid breaking existing code until we update it.
