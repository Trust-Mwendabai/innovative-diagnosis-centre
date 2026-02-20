-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2026 at 12:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zambia_test_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `target_type`, `target_id`, `details`, `created_at`) VALUES
(1, 1, 'Staff Assigned', 'appointment', 1, 'ID: 1 to 2026-02-16 Staff ID: 2', '2026-02-13 07:03:17'),
(2, 1, 'Deleted Branch', 'branch', 2, 'Location removed.', '2026-02-14 07:58:35'),
(3, 1, 'Sent Notification', 'notification', 1, 'Group: patient', '2026-02-20 07:40:58'),
(4, 1, 'Sent Notification', 'notification', 2, 'Group: everyone', '2026-02-20 07:41:17'),
(5, 1, 'Sent Notification', 'notification', 3, 'Group: everyone', '2026-02-20 07:41:31'),
(6, 1, 'Sent Notification', 'notification', 4, 'Group: patient', '2026-02-20 07:55:03'),
(7, 1, 'Created Blog Post', 'blog', 1, 'Title: New Article', '2026-02-20 08:49:51'),
(8, 1, 'Deleted Blog Post', 'blog', 1, 'Article removed.', '2026-02-20 09:39:46');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(20) NOT NULL,
  `location_type` enum('branch','home') NOT NULL,
  `is_home_collection` tinyint(1) DEFAULT 0,
  `branch_id` varchar(50) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `test_id` varchar(100) DEFAULT NULL,
  `test_ids` text DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `name`, `email`, `phone`, `date`, `time`, `location_type`, `is_home_collection`, `branch_id`, `staff_id`, `test_id`, `test_ids`, `total_price`, `status`, `created_at`) VALUES
(1, 1, 'Trust Muhau Mwendabai', 'trustmuhaumwendabai@gmail.com', '+260777342846', '2026-02-16', '10:30', 'branch', 0, '0', 2, 'mens', NULL, NULL, 'pending', '2026-02-13 06:00:14'),
(2, 1, 'trust', 'trustmuhaum@gmail.com', '0987654321', '2026-02-17', '11:00', 'branch', 0, 'lusaka-main', NULL, 'rbs', NULL, NULL, 'pending', '2026-02-14 06:55:44');

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `read_time` varchar(50) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `excerpt`, `category`, `read_time`, `slug`, `content`, `author_id`, `featured_image`, `image`, `status`, `created_at`) VALUES
(2, 'Understanding Your Blood Test Results', 'A comprehensive guide to interpreting your lab reports and what those numbers actually mean for your health.', 'Education', '5 min', 'understanding-blood-test-results', 'Full blood count (FBC) is one of the most common tests. It measures different types of cells in your blood, including red blood cells, white blood cells, and platelets. Low red blood cell count (anemia) can cause fatigue, while high white blood cell count might indicate an infection. This guide helps you navigate the complex terminology used in diagnostic reports.', 1, NULL, 'https://images.unsplash.com/photo-1579152276506-53b64f351337?q=80&w=2070&auto=format&fit=crop', 'published', '2026-02-20 08:57:23'),
(3, 'The Importance of Annual Diagnostic Screenings', 'Why regular checkups are the secret to long-term wellness and early detection of potential health risks.', 'Wellness', '4 min', 'importance-of-annual-screenings', 'Preventative healthcare is always better than reactive treatment. Annual screenings can detect chronic conditions like diabetes, hypertension, and high cholesterol long before symptoms appear. At IDC, we use state-of-the-art diagnostic tools to provide a clear picture of your internal health architecture.', 1, NULL, 'https://images.unsplash.com/photo-1576091160550-217359971f8b?q=80&w=2070&auto=format&fit=crop', 'published', '2026-02-20 08:57:23'),
(4, 'Preparing for Your Ultrasound: What to Expect', 'Everything you need to know about preparing for an imaging session, from fasting requirements to clothing choices.', 'Tips', '3 min', 'preparing-for-your-ultrasound', 'Ultrasound imaging uses sound waves to create pictures of the inside of the body. It is safe, non-invasive, and does not use radiation. Depending on the type of scan, you might need to drink several glasses of water or fast for 8-12 hours. This article provides a step-by-step preparation list for our patients.', 1, NULL, 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop', 'published', '2026-02-20 08:57:23');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `opening_hours` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `address`, `phone`, `email`, `opening_hours`, `images`, `created_at`) VALUES
(1, 'Main Branch', 'Chachacha Road, Lusaka', '+260123456789', NULL, NULL, NULL, '2026-02-13 06:35:01');

-- --------------------------------------------------------

--
-- Table structure for table `cms_content`
--

CREATE TABLE `cms_content` (
  `id` int(11) NOT NULL,
  `page` varchar(50) NOT NULL,
  `section` varchar(50) NOT NULL,
  `content_key` varchar(100) NOT NULL,
  `content_value` text DEFAULT NULL,
  `content_type` enum('text','image','json','html') DEFAULT 'text',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `health_metrics`
--

CREATE TABLE `health_metrics` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `metric_name` varchar(100) NOT NULL,
  `metric_value` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `recorded_at` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `health_metrics`
--

INSERT INTO `health_metrics` (`id`, `patient_id`, `metric_name`, `metric_value`, `unit`, `recorded_at`, `created_at`) VALUES
(1, 1, 'Blood Sugar', 5.79, 'mmol/L', '2026-02-05', '2026-02-17 05:38:15'),
(2, 1, 'Blood Sugar', 5.00, 'mmol/L', '2026-01-01', '2026-02-17 05:38:15'),
(3, 1, 'Blood Sugar', 6.06, 'mmol/L', '2025-12-03', '2026-02-17 05:38:15'),
(4, 1, 'Blood Sugar', 5.85, 'mmol/L', '2025-11-11', '2026-02-17 05:38:15'),
(5, 1, 'Blood Sugar', 6.31, 'mmol/L', '2025-09-26', '2026-02-17 05:38:15'),
(6, 1, 'Blood Sugar', 6.42, 'mmol/L', '2025-08-31', '2026-02-17 05:38:15'),
(7, 1, 'Cholesterol', 170.43, 'mg/dL', '2026-02-11', '2026-02-17 05:38:15'),
(8, 1, 'Cholesterol', 175.90, 'mg/dL', '2026-01-04', '2026-02-17 05:38:15'),
(9, 1, 'Cholesterol', 174.48, 'mg/dL', '2025-12-10', '2026-02-17 05:38:15'),
(10, 1, 'Cholesterol', 190.74, 'mg/dL', '2025-11-14', '2026-02-17 05:38:15'),
(11, 1, 'Cholesterol', 171.74, 'mg/dL', '2025-10-08', '2026-02-17 05:38:15'),
(12, 1, 'Cholesterol', 176.29, 'mg/dL', '2025-08-25', '2026-02-17 05:38:15'),
(13, 1, 'Blood Pressure (Sys)', 119.11, 'mmHg', '2026-02-05', '2026-02-17 05:38:15'),
(14, 1, 'Blood Pressure (Sys)', 115.17, 'mmHg', '2026-01-11', '2026-02-17 05:38:15'),
(15, 1, 'Blood Pressure (Sys)', 116.81, 'mmHg', '2025-11-29', '2026-02-17 05:38:15'),
(16, 1, 'Blood Pressure (Sys)', 125.42, 'mmHg', '2025-11-03', '2026-02-17 05:38:16'),
(17, 1, 'Blood Pressure (Sys)', 123.99, 'mmHg', '2025-09-24', '2026-02-17 05:38:16'),
(18, 1, 'Blood Pressure (Sys)', 125.85, 'mmHg', '2025-08-24', '2026-02-17 05:38:16'),
(19, 1, 'Blood Pressure (Dia)', 77.10, 'mmHg', '2026-02-06', '2026-02-17 05:38:16'),
(20, 1, 'Blood Pressure (Dia)', 78.66, 'mmHg', '2026-01-13', '2026-02-17 05:38:16'),
(21, 1, 'Blood Pressure (Dia)', 79.34, 'mmHg', '2025-12-14', '2026-02-17 05:38:16'),
(22, 1, 'Blood Pressure (Dia)', 79.14, 'mmHg', '2025-11-15', '2026-02-17 05:38:16'),
(23, 1, 'Blood Pressure (Dia)', 81.15, 'mmHg', '2025-10-03', '2026-02-17 05:38:16'),
(24, 1, 'Blood Pressure (Dia)', 82.07, 'mmHg', '2025-09-10', '2026-02-17 05:38:16'),
(25, 2, 'Blood Sugar', 5.79, 'mmol/L', '2026-01-29', '2026-02-17 05:38:16'),
(26, 2, 'Blood Sugar', 5.57, 'mmol/L', '2026-01-06', '2026-02-17 05:38:16'),
(27, 2, 'Blood Sugar', 5.63, 'mmol/L', '2025-12-02', '2026-02-17 05:38:16'),
(28, 2, 'Blood Sugar', 5.28, 'mmol/L', '2025-11-05', '2026-02-17 05:38:16'),
(29, 2, 'Blood Sugar', 6.19, 'mmol/L', '2025-09-22', '2026-02-17 05:38:16'),
(30, 2, 'Blood Sugar', 6.25, 'mmol/L', '2025-09-07', '2026-02-17 05:38:16'),
(31, 2, 'Cholesterol', 182.49, 'mg/dL', '2026-02-09', '2026-02-17 05:38:16'),
(32, 2, 'Cholesterol', 178.89, 'mg/dL', '2026-01-04', '2026-02-17 05:38:16'),
(33, 2, 'Cholesterol', 188.81, 'mg/dL', '2025-11-24', '2026-02-17 05:38:16'),
(34, 2, 'Cholesterol', 199.55, 'mg/dL', '2025-11-12', '2026-02-17 05:38:16'),
(35, 2, 'Cholesterol', 180.79, 'mg/dL', '2025-10-17', '2026-02-17 05:38:16'),
(36, 2, 'Cholesterol', 180.98, 'mg/dL', '2025-08-26', '2026-02-17 05:38:16'),
(37, 2, 'Blood Pressure (Sys)', 115.59, 'mmHg', '2026-02-17', '2026-02-17 05:38:16'),
(38, 2, 'Blood Pressure (Sys)', 116.58, 'mmHg', '2026-01-05', '2026-02-17 05:38:16'),
(39, 2, 'Blood Pressure (Sys)', 120.47, 'mmHg', '2025-11-30', '2026-02-17 05:38:16'),
(40, 2, 'Blood Pressure (Sys)', 126.91, 'mmHg', '2025-11-12', '2026-02-17 05:38:16'),
(41, 2, 'Blood Pressure (Sys)', 134.24, 'mmHg', '2025-10-16', '2026-02-17 05:38:16'),
(42, 2, 'Blood Pressure (Sys)', 127.21, 'mmHg', '2025-08-30', '2026-02-17 05:38:16'),
(43, 2, 'Blood Pressure (Dia)', 75.70, 'mmHg', '2026-02-05', '2026-02-17 05:38:16'),
(44, 2, 'Blood Pressure (Dia)', 81.50, 'mmHg', '2025-12-31', '2026-02-17 05:38:16'),
(45, 2, 'Blood Pressure (Dia)', 84.43, 'mmHg', '2025-12-03', '2026-02-17 05:38:16'),
(46, 2, 'Blood Pressure (Dia)', 83.79, 'mmHg', '2025-10-22', '2026-02-17 05:38:16'),
(47, 2, 'Blood Pressure (Dia)', 82.27, 'mmHg', '2025-09-24', '2026-02-17 05:38:16'),
(48, 2, 'Blood Pressure (Dia)', 81.02, 'mmHg', '2025-09-02', '2026-02-17 05:38:16'),
(49, 3, 'Blood Sugar', 5.07, 'mmol/L', '2026-02-17', '2026-02-17 05:38:16'),
(50, 3, 'Blood Sugar', 6.49, 'mmol/L', '2025-12-26', '2026-02-17 05:38:16'),
(51, 3, 'Blood Sugar', 5.32, 'mmol/L', '2025-11-27', '2026-02-17 05:38:16'),
(52, 3, 'Blood Sugar', 5.64, 'mmol/L', '2025-11-12', '2026-02-17 05:38:16'),
(53, 3, 'Blood Sugar', 5.62, 'mmol/L', '2025-09-24', '2026-02-17 05:38:16'),
(54, 3, 'Blood Sugar', 5.09, 'mmol/L', '2025-09-13', '2026-02-17 05:38:16'),
(55, 3, 'Cholesterol', 175.93, 'mg/dL', '2026-02-09', '2026-02-17 05:38:16'),
(56, 3, 'Cholesterol', 176.41, 'mg/dL', '2026-01-06', '2026-02-17 05:38:16'),
(57, 3, 'Cholesterol', 190.59, 'mg/dL', '2025-12-03', '2026-02-17 05:38:16'),
(58, 3, 'Cholesterol', 171.22, 'mg/dL', '2025-11-07', '2026-02-17 05:38:16'),
(59, 3, 'Cholesterol', 183.87, 'mg/dL', '2025-09-24', '2026-02-17 05:38:16'),
(60, 3, 'Cholesterol', 171.71, 'mg/dL', '2025-08-22', '2026-02-17 05:38:16'),
(61, 3, 'Blood Pressure (Sys)', 134.51, 'mmHg', '2026-01-31', '2026-02-17 05:38:16'),
(62, 3, 'Blood Pressure (Sys)', 130.06, 'mmHg', '2026-01-13', '2026-02-17 05:38:16'),
(63, 3, 'Blood Pressure (Sys)', 117.44, 'mmHg', '2025-11-27', '2026-02-17 05:38:16'),
(64, 3, 'Blood Pressure (Sys)', 124.67, 'mmHg', '2025-11-01', '2026-02-17 05:38:16'),
(65, 3, 'Blood Pressure (Sys)', 134.09, 'mmHg', '2025-09-21', '2026-02-17 05:38:16'),
(66, 3, 'Blood Pressure (Sys)', 123.90, 'mmHg', '2025-09-15', '2026-02-17 05:38:16'),
(67, 3, 'Blood Pressure (Dia)', 82.90, 'mmHg', '2026-02-16', '2026-02-17 05:38:16'),
(68, 3, 'Blood Pressure (Dia)', 83.45, 'mmHg', '2025-12-30', '2026-02-17 05:38:16'),
(69, 3, 'Blood Pressure (Dia)', 82.55, 'mmHg', '2025-12-06', '2026-02-17 05:38:16'),
(70, 3, 'Blood Pressure (Dia)', 75.26, 'mmHg', '2025-10-20', '2026-02-17 05:38:16'),
(71, 3, 'Blood Pressure (Dia)', 82.62, 'mmHg', '2025-10-14', '2026-02-17 05:38:16'),
(72, 3, 'Blood Pressure (Dia)', 83.87, 'mmHg', '2025-08-20', '2026-02-17 05:38:16');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `recipient_group` varchar(50) NOT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'system',
  `status` varchar(50) DEFAULT 'sent',
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `recipient_group`, `recipient_id`, `title`, `message`, `type`, `status`, `sent_at`) VALUES
(1, 'patient', NULL, 'fgh', 'dfg', 'system', 'sent', '2026-02-20 07:40:58'),
(2, 'doctor', NULL, 'New ', 'newssss', 'system', 'sent', '2026-02-20 07:41:17'),
(3, 'everyone', NULL, 'ghvhj ', 'qwertyuiosdfghjkxcvb\ndfvyuhbzduiz\nv\n\nnp\nn s', 'system', 'sent', '2026-02-20 07:41:31'),
(4, 'patient', NULL, 'qwer', 'tgvrcedxs', 'system', 'sent', '2026-02-20 07:55:03');

-- --------------------------------------------------------

--
-- Table structure for table `notification_logs`
--

CREATE TABLE `notification_logs` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `type` enum('sms','whatsapp','email') DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('queued','sent','failed') DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `name`, `email`, `phone`, `address`, `dob`, `gender`, `blood_group`, `weight`, `height`, `created_at`) VALUES
(1, 4, 'trust', 'trustmuhaumwendabai@gmail.com', '0987654321', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-14 14:12:56'),
(2, 6, 'tr', 'trustmuhau@gmail.com', '0777342846', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-14 14:13:58'),
(3, 7, 'trust', 'trustmuhaumwe@gmail.com', '098765432', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-14 15:05:11');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `medication` varchar(255) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `instructions` text DEFAULT NULL,
  `status` enum('active','discontinued','completed') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','staff','technician','billing') DEFAULT 'staff',
  `branch_id` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `email`, `role`, `branch_id`, `phone`, `created_at`) VALUES
(1, 'Dr. Smith', 'smith@idc.zm', 'admin', 1, NULL, '2026-02-13 06:35:01'),
(2, 'Nurse Mary', 'mary@idc.zm', 'staff', 1, NULL, '2026-02-13 06:35:01'),
(3, 'Tech John', 'john@idc.zm', 'technician', NULL, NULL, '2026-02-13 06:35:01');

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `turnaround_time` varchar(50) DEFAULT NULL,
  `preparation` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`id`, `name`, `description`, `category`, `price`, `turnaround_time`, `preparation`, `status`, `created_at`) VALUES
(1, 'Comprehensive Mens Health Panel', 'Full diagnostic suite for mens vitality and endocrine health.', NULL, 250.00, '48h', NULL, 'active', '2026-02-17 06:25:28'),
(2, 'Full Blood Count (FBC)', 'Basic screening test for anemia, infection and blood health.', NULL, 45.00, '24h', NULL, 'active', '2026-02-17 06:25:28'),
(3, 'Diabetes Screening (HbA1c)', 'Measures your average blood sugar levels over the past 3 months.', NULL, 85.00, '24h', NULL, 'active', '2026-02-17 06:25:28'),
(4, 'Liver Function Profile', 'Evaluates enzymes and proteins for hepatic assessment.', NULL, 110.00, '48h', NULL, 'active', '2026-02-17 06:25:28'),
(5, 'Kidney Function Test', 'Diagnostic assessment of urea, creatinine and electrolytes.', NULL, 95.00, '24h', NULL, 'active', '2026-02-17 06:25:28');

-- --------------------------------------------------------

--
-- Table structure for table `test_packages`
--

CREATE TABLE `test_packages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `test_ids` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test_results`
--

CREATE TABLE `test_results` (
  `id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `status` enum('pending','uploaded','delivered') DEFAULT 'pending',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` enum('admin','staff','doctor','patient') DEFAULT 'patient',
  `password` varchar(255) NOT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expiry` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `password`, `otp_code`, `otp_expiry`, `created_at`) VALUES
(1, 'Admin', 'admin@innovativediagnosiscentre.co.zm', NULL, 'admin', '$2y$10$D7RiPRMXkbr4mekZTv1VqOnKPYdbaxIRigkrcr7PBjnyHSRHcHyvW', NULL, NULL, '2026-02-13 05:36:12'),
(4, 'trust', 'trustmuhaumwendabai@gmail.com', '0987654321', 'patient', '$2y$10$QXX3m57W655pt/oXEp5duOSCU1wYcn2MPmKOo9WyEBhiW5tf1HLqy', '123456', '2026-02-14 13:23:06', '2026-02-14 14:12:56'),
(6, 'tr', 'trustmuhau@gmail.com', '0777342846', 'patient', '$2y$10$n3Ld47eCHgjtZnREmXQoeegi46e9HDY84.zTQfnrpIq/6wgo/ikjK', '123456', '2026-02-14 13:24:04', '2026-02-14 14:13:58'),
(7, 'trust', 'trustmuhaumwe@gmail.com', '098765432', 'patient', '$2y$10$ZXNUFAxGGKzOxEpKx9S9Iu8jwaVVnFqpdu4sIPMv9kmbPpGjX0Fye', NULL, NULL, '2026-02-14 15:05:11'),
(8, 'Dr. Zambian Medic', 'doctor@innovativediagnosiscentre.co.zm', NULL, 'doctor', '$2y$10$3QppUG1HRgpXOarwfSuMzeAkOkbPYtr0J.foGi0Tl6.TSfi6CKFce', NULL, NULL, '2026-02-17 06:32:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_appointments_patient` (`patient_id`),
  ADD KEY `idx_appointments_date` (`date`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cms_content`
--
ALTER TABLE `cms_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `health_metrics`
--
ALTER TABLE `health_metrics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_logs`
--
ALTER TABLE `notification_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_packages`
--
ALTER TABLE `test_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_results`
--
ALTER TABLE `test_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `idx_test_results_patient` (`patient_id`),
  ADD KEY `idx_test_results_date` (`uploaded_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cms_content`
--
ALTER TABLE `cms_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `health_metrics`
--
ALTER TABLE `health_metrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notification_logs`
--
ALTER TABLE `notification_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `test_packages`
--
ALTER TABLE `test_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_results`
--
ALTER TABLE `test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `health_metrics`
--
ALTER TABLE `health_metrics`
  ADD CONSTRAINT `health_metrics_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `test_results`
--
ALTER TABLE `test_results`
  ADD CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `test_results_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
