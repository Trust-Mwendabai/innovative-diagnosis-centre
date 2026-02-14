-- IDC Management System: Expanded Schema

-- Branches Management
CREATE TABLE IF NOT EXISTS `branches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT,
    `phone` VARCHAR(20),
    `email` VARCHAR(100),
    `opening_hours` TEXT,
    `images` TEXT, -- JSON array of image paths
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Staff Management
CREATE TABLE IF NOT EXISTS `staff` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `role` ENUM('admin', 'staff', 'technician', 'billing') DEFAULT 'staff',
    `branch_id` INT,
    `phone` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tests and Packages
CREATE TABLE IF NOT EXISTS `tests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(100),
    `price` DECIMAL(10, 2) NOT NULL,
    `turnaround_time` VARCHAR(50), -- e.g. "24 Hours"
    `preparation` TEXT, -- preparation instructions
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `test_packages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10, 2) NOT NULL,
    `test_ids` TEXT, -- JSON array of test IDs
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Normalize Patients
CREATE TABLE IF NOT EXISTS `patients` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100),
    `phone` VARCHAR(20),
    `address` TEXT,
    `dob` DATE,
    `gender` ENUM('male', 'female', 'other'),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Update Appointments Table Structure
-- (Note: Run these after creating above tables)
-- ALTER TABLE `appointments` ADD COLUMN `patient_id` INT AFTER `id`;
-- ALTER TABLE `appointments` ADD COLUMN `branch_id` INT;
-- ALTER TABLE `appointments` ADD COLUMN `staff_id` INT;
-- ALTER TABLE `appointments` ADD COLUMN `test_ids` TEXT; -- JSON array
-- ALTER TABLE `appointments` ADD COLUMN `total_price` DECIMAL(10, 2);
-- ALTER TABLE `appointments` ADD COLUMN `is_home_collection` BOOLEAN DEFAULT FALSE;

-- Result Management
CREATE TABLE IF NOT EXISTS `test_results` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `appointment_id` INT NOT NULL,
    `patient_id` INT NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(50), -- pdf, jpeg, etc.
    `status` ENUM('pending', 'uploaded', 'delivered') DEFAULT 'pending',
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Content Management (CMS)
CREATE TABLE IF NOT EXISTS `cms_content` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `page` VARCHAR(50) NOT NULL,
    `section` VARCHAR(50) NOT NULL,
    `content_key` VARCHAR(100) NOT NULL,
    `content_value` TEXT,
    `content_type` ENUM('text', 'image', 'json', 'html') DEFAULT 'text',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `blog_posts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `content` LONGTEXT,
    `author_id` INT,
    `featured_image` VARCHAR(255),
    `status` ENUM('draft', 'published') DEFAULT 'draft',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Activity Feed & Notifications
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT, -- links to users or staff
    `action` VARCHAR(100) NOT NULL,
    `target_type` VARCHAR(50), -- e.g. "appointment", "test"
    `target_id` INT,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notification_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT,
    `type` ENUM('sms', 'whatsapp', 'email'),
    `message` TEXT,
    `status` ENUM('queued', 'sent', 'failed'),
    `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
