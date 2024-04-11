-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Apr 11, 2024 at 10:21 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_crud`
--

-- --------------------------------------------------------

--
-- Table structure for table `mb_team_member`
--

CREATE TABLE `mb_team_member` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fk_permission_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mb_team_member`
--

INSERT INTO `mb_team_member` (`id`, `user_name`, `password_hash`, `fk_permission_id`, `created_at`) VALUES
(1, 'Kevin', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 1, '2024-01-14 17:56:32'),
(2, 'Linda', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 1, '2024-02-04 10:39:55'),
(3, 'Guest', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 3, '2024-02-05 09:01:21'),
(4, 'Tyler', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 1, '2024-02-06 01:04:25'),
(5, 'Johnny', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 1, '2024-02-06 01:04:25'),
(6, 'Tony', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 1, '2024-02-06 01:04:25'),
(7, 'Ellie', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', 1, '2024-02-06 01:04:25'),
(8, 'Admin', '$2y$10$4rkbTbvSx/YSFzAKgPGwNunGlKwDkfYUDta98G4SNtrzoo7Vxu1xC', NULL, '2024-04-11 08:15:13');

-- --------------------------------------------------------

--
-- Table structure for table `mb_user`
--

CREATE TABLE `mb_user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `fk_skin_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mb_user`
--

INSERT INTO `mb_user` (`id`, `name`, `email`, `phone`, `password_hash`, `profile_pic_url`, `birthday`, `created_at`, `fk_skin_id`) VALUES
(1, 'John Doe', 'john@example.com', '+1234567890', 'hashed_password_here', 'profile_pic_url_here', '1990-01-15', '2024-01-09 20:30:00', 3001),
(2, 'Jane Doe', 'jane@example.com', NULL, 'hashed_password_here', 'profile_pic_url_here', '1985-05-20', '2024-01-09 21:45:00', 3002),
(3, 'Bob Smith', 'bob@example.com', '+9876543210', 'hashed_password_here', NULL, '1978-08-08', '2024-01-09 22:15:00', 3001),
(4, 'Grace Taylor', 'grace_taylor@example.com', '+1789012345', 'hashed_password_30', 'profile_pic_url_30', '1991-02-10', '2024-01-22 23:42:45', 3002),
(5, 'Liam Johnson', 'liam_johnson@example.com', '+1890123456', 'hashed_password_31', 'profile_pic_url_31', '1982-11-25', '2024-01-22 23:43:30', 3001),
(6, 'John Doe', 'john1@example.com', '+1234557890', 'hashed_password_here', 'profile_pic_url_here', '1990-01-15', '2024-01-22 23:38:48', 3001),
(7, 'Liam Turner', 'liam@example.com', '+1432109876', 'hashed_password_18', 'profile_pic_url_18', '1995-04-08', '2024-01-22 23:38:48', 3002),
(8, 'Ella Adams', 'ella@example.com', '+1209876543', 'hashed_password_19', 'profile_pic_url_19', '1987-10-12', '2024-01-22 23:38:48', 3001),
(9, 'Noah Mitchell', 'noah@example.com', '+1987654321', 'hashed_password_20', 'profile_pic_url_20', '1992-01-30', '2024-01-22 23:38:48', 3002),
(10, 'Mia Turner', 'mia@example.com', '+1765432109', 'hashed_password_21', 'profile_pic_url_21', '1984-06-18', '2024-01-22 23:38:48', 3001),
(11, 'Ethan Carter', 'ethan@example.com', '+1543210987', 'hashed_password_22', 'profile_pic_url_22', '1999-11-04', '2024-01-22 23:38:48', 3002),
(12, 'Aria Evans', 'aria@example.com', '+1321098765', 'hashed_password_23', 'profile_pic_url_23', '1986-03-26', '2024-01-22 23:38:48', 3001),
(13, 'Carter Hall', 'carter@example.com', '+1098765432', 'hashed_password_24', 'profile_pic_url_24', '1994-08-13', '2024-01-22 23:38:48', 3002),
(14, 'Luna Martinez', 'luna@example.com', '+1876543210', 'hashed_password_25', 'profile_pic_url_25', '1990-12-01', '2024-01-22 23:38:48', 3001),
(15, 'Mason Scott', 'mason@example.com', '+1654321098', 'hashed_password_26', 'profile_pic_url_26', '1997-02-28', '2024-01-22 23:38:48', 3002),
(16, 'Mia Davis', 'mia_davis@example.com', '+1901234567', 'hashed_password_32', 'profile_pic_url_32', '1998-06-18', '2024-01-22 23:44:15', 3002),
(17, 'Noah Smith', 'noah_smith@example.com', '+2012345678', 'hashed_password_33', 'profile_pic_url_33', '1994-01-23', '2024-01-22 23:45:00', 3001),
(18, 'Olivia Turner', 'olivia_turner@example.com', '+2123456789', 'hashed_password_34', 'profile_pic_url_34', '1987-08-14', '2024-01-22 23:45:45', 3002),
(19, 'John Doe', 'john27@example.com', '+1234557880', 'hashed_password_here', 'profile_pic_url_here', '1990-01-15', '2024-01-22 23:39:18', 3001),
(20, 'Sophia King', 'sophia@example.com', '+1456789012', 'hashed_password_27', 'profile_pic_url_27', '1993-09-22', '2024-01-22 23:40:30', 3001),
(21, 'Henry Wilson', 'henry@example.com', '+1567890123', 'hashed_password_28', 'profile_pic_url_28', '1989-07-14', '2024-01-22 23:41:15', 3002),
(22, 'Ava Brown', 'ava@example.com', '+1678901234', 'hashed_password_29', 'profile_pic_url_29', '1996-12-07', '2024-01-22 23:42:00', 3001),
(23, 'John Doe', 'jo457hn27@example.com', '+12347880', 'hashed_password_here', 'profile_pic_url_here', '1990-01-15', '2024-01-22 23:39:58', 3001),
(24, 'Liam Turner', 'lam@example.com', '+1132109876', 'hashed_password_18', 'profile_pic_url_18', '1995-04-08', '2024-01-22 23:39:58', 3002),
(25, 'Elijah Hall', 'elijah_hall@example.com', '+2234567890', 'hashed_password_35', 'profile_pic_url_35', '1992-05-07', '2024-01-22 23:46:30', 3001),
(26, 'Lily Scott', 'lily_scott@example.com', '+2345678901', 'hashed_password_36', 'profile_pic_url_36', '1983-01-24', '2024-01-22 23:47:15', 3002),
(27, 'Aiden Martinez', 'aiden_martinez@example.com', '+2456789012', 'hashed_password_37', 'profile_pic_url_37', '1996-10-19', '2024-01-22 23:48:00', 3001),
(28, 'Zoey Turner', 'zoey_turner@example.com', '+2567890123', 'hashed_password_38', 'profile_pic_url_38', '1985-07-26', '2024-01-22 23:48:45', 3002),
(29, 'Jackson Reed', 'jackson_reed@example.com', '+2678901234', 'hashed_password_39', 'profile_pic_url_39', '1999-02-28', '2024-01-22 23:49:30', 3001),
(30, 'Sofia Johnson', 'sofia_johnson@example.com', '+2789012345', 'hashed_password_40', 'profile_pic_url_40', '1990-08-15', '2024-01-22 23:50:15', 3002),
(31, 'Evelyn Adams', 'evelyn_adams@example.com', '+12345678902', 'hashed_password_41', 'profile_pic_url_41', '1995-05-12', '2024-01-23 00:30:00', 3001),
(32, 'Matthew Turner', 'matthew_turner@example.com', '+23456789013', 'hashed_password_42', 'profile_pic_url_42', '1988-12-25', '2024-01-23 00:45:00', 3002),
(33, 'Chloe Wilson', 'chloe_wilson@example.com', '+34567890124', 'hashed_password_43', 'profile_pic_url_43', '1997-07-08', '2024-01-23 01:00:00', 3001),
(34, 'Daniel Reed', 'daniel_reed@example.com', '+45678901235', 'hashed_password_44', 'profile_pic_url_44', '1982-02-01', '2024-01-23 01:15:00', 3002),
(35, 'Grace Carter', 'grace_carter@example.com', '+56789012346', 'hashed_password_45', 'profile_pic_url_45', '1993-09-16', '2024-01-23 01:30:00', 3001),
(36, 'Michael Hall', 'michael_hall@example.com', '+67890123457', 'hashed_password_46', 'profile_pic_url_46', '1986-04-29', '2024-01-23 01:45:00', 3002),
(37, 'Lily Martinez', 'lily_martinez@example.com', '+78901234568', 'hashed_password_47', 'profile_pic_url_47', '1991-11-12', '2024-01-23 02:00:00', 3001),
(38, 'Jack Scott', 'jack_scott@example.com', '+89012345679', 'hashed_password_48', 'profile_pic_url_48', '1984-06-25', '2024-01-23 02:15:00', 3002),
(39, 'Sophia Turner', 'sophia_turner@example.com', '+90123456780', 'hashed_password_49', 'profile_pic_url_49', '1998-01-30', '2024-01-23 02:30:00', 3001),
(40, 'William Johnson', 'william_johnson@example.com', '+12345678903', 'hashed_password_50', 'profile_pic_url_50', '1989-08-13', '2024-01-23 02:45:00', 3002),
(41, 'Emily Davis', 'emily_davis@example.com', '+23456789014', 'hashed_password_51', 'profile_pic_url_51', '1995-03-26', '2024-01-23 03:00:00', 3001),
(42, 'Oliver Smith', 'oliver_smith@example.com', '+34567890125', 'hashed_password_52', 'profile_pic_url_52', '1980-10-09', '2024-01-23 03:15:00', 3002),
(43, 'Ava Adams', 'ava_adams@example.com', '+45678901236', 'hashed_password_53', 'profile_pic_url_53', '1992-05-02', '2024-01-23 03:30:00', 3001),
(44, 'James Mitchell', 'james_mitchell@example.com', '+56789012347', 'hashed_password_54', 'profile_pic_url_54', '1983-12-15', '2024-01-23 03:45:00', 3002),
(45, 'Emma Brown', 'emma_brown@example.com', '+67890123458', 'hashed_password_55', 'profile_pic_url_55', '1997-07-28', '2024-01-23 04:00:00', 3001),
(46, 'Daniel Turner', 'daniel_turner@example.com', '+78901234569', 'hashed_password_56', 'profile_pic_url_56', '1984-02-10', '2024-01-23 04:15:00', 3002),
(47, 'Olivia Hall', 'olivia_hall@example.com', '+89012345670', 'hashed_password_57', 'profile_pic_url_57', '1990-09-23', '2024-01-23 04:30:00', 3001),
(48, 'Ethan Martinez', 'ethan_martinez@example.com', '+90123456781', 'hashed_password_58', 'profile_pic_url_58', '1994-04-07', '2024-01-23 04:45:00', 3002),
(49, 'Isabella Scott', 'isabella_scott@example.com', '+12345678904', 'hashed_password_59', 'profile_pic_url_59', '1988-01-20', '2024-01-23 05:00:00', 3001),
(50, 'Benjamin Johnson', 'benjamin_johnson@example.com', '+23456789015', 'hashed_password_60', 'profile_pic_url_60', '1996-06-03', '2024-01-23 05:15:00', 3002),
(51, 'Aria Turner', 'aria_turner@example.com', '+34567890126', 'hashed_password_61', 'profile_pic_url_61', '1982-11-16', '2024-01-23 05:30:00', 3001),
(52, 'Mason Davis', 'mason_davis@example.com', '+45678901237', 'hashed_password_62', 'profile_pic_url_62', '1995-04-05', '2024-01-23 05:45:00', 3002),
(53, 'Liam Wilson', 'liam_wilson@example.com', '+56789012348', 'hashed_password_63', 'profile_pic_url_63', '1993-08-18', '2024-01-23 06:00:00', 3001),
(54, 'Ava Turner', 'ava_turner@example.com', '0912234344', 'hashed_password_64', 'profile_pic_url_64', '1986-01-30', '2024-01-23 06:15:00', 3003),
(57, 'Jane', 'JaneExample@gmail.com', '0912234345', 'hashed_pass', 'profile_url', '2000-04-07', '2024-02-04 01:37:40', NULL),
(58, 'Jake', 'jake01@example.com', '09123456789', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1990-01-01', '2024-02-05 15:32:06', 3001),
(59, 'Emma', 'emma02@example.com', '09123456788', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1990-02-02', '2024-02-05 15:32:06', 3002),
(60, 'Noah', 'noah03@example.com', '09123456787', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1990-03-03', '2024-02-05 15:32:06', 3003),
(61, 'Olivia', 'olivia04@example.com', '09123456786', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1990-04-04', '2024-02-05 15:32:06', 3001),
(62, 'Liam', 'liam05@example.com', '09123456785', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1990-05-05', '2024-02-05 15:32:06', 3002),
(63, 'Sophia', 'sophia06@example.com', '09123456684', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1990-06-06', '2024-02-05 15:32:06', 3003),
(64, 'Jackson', 'jackson07@example.com', '09123456683', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1990-07-07', '2024-02-05 15:32:06', 3001),
(65, 'Ava', 'ava08@example.com', '09123456682', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1990-08-08', '2024-02-05 15:32:06', 3002),
(66, 'Ethan', 'ethan100@example.com', '09123456589', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1990-12-10', '2024-02-05 15:32:06', 3003),
(67, 'Sophie', 'sophie09@example.com', '09123456588', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1990-09-09', '2024-02-05 15:32:06', 3001),
(68, 'Mason', 'mason10@example.com', '09123456587', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1990-10-10', '2024-02-05 15:32:06', 3002),
(69, 'Isabella', 'isabella11@example.com', '09123456586', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1990-11-11', '2024-02-05 15:32:06', 3003),
(70, 'Aiden', 'aiden12@example.com', '09123456585', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1990-12-12', '2024-02-05 15:32:06', 3001),
(71, 'Aria', 'aria13@example.com', '09123456484', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1991-01-13', '2024-02-05 15:32:06', 3002),
(72, 'Caden', 'caden14@example.com', '09123456483', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1991-02-14', '2024-02-05 15:32:06', 3003),
(73, 'Zoe', 'zoe15@example.com', '09123456482', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1991-03-15', '2024-02-05 15:32:06', 3001),
(74, 'Grayson', 'grayson16@example.com', '09123456481', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345676', NULL, '1991-04-16', '2024-02-05 15:32:06', 3002),
(75, 'Lily', 'lily17@example.com', '09123456480', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345677', NULL, '1991-05-17', '2024-02-05 15:32:06', 3003),
(76, 'Mia', 'mia18@example.com', '09123456389', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1991-06-18', '2024-02-05 15:32:06', 3001),
(77, 'Lucas', 'lucas100@example.com', '09123456388', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1991-12-20', '2024-02-05 15:32:06', 3002),
(78, 'Harper', 'harper101@example.com', '09123456387', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1991-12-21', '2024-02-05 15:32:06', 3003),
(79, 'Logan', 'logan102@example.com', '09123456386', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1991-12-22', '2024-02-05 15:32:06', 3001),
(80, 'Evelyn', 'evelyn200@example.com', '09123456289', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1991-12-30', '2024-02-05 15:32:06', 3003),
(81, 'Olivia', 'olivia19@example.com', '090912345678', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1991-12-31', '2024-02-05 15:32:06', 3001),
(82, 'Noah', 'noah20@example.com', '090912345677', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1992-01-01', '2024-02-05 15:32:06', 3002),
(83, 'Emma', 'emma21@example.com', '090912345676', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1992-02-02', '2024-02-05 15:32:06', 3003),
(84, 'Liam', 'liam22@example.com', '090912345675', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1992-03-03', '2024-02-05 15:32:06', 3001),
(85, 'Oliver', 'oliver23@example.com', '090912345674', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1992-04-04', '2024-02-05 15:32:06', 3002),
(86, 'Ava', 'ava24@example.com', '090912345773', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1992-05-05', '2024-02-05 15:32:06', 3003),
(87, 'Ethan', 'ethan25@example.com', '090912345999', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345775', NULL, '1992-06-06', '2024-02-05 15:32:06', 3001),
(88, 'Harper', 'harper26@example.com', '090912345899', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345776', NULL, '1992-07-07', '2024-02-05 15:32:06', 3002),
(89, 'Amelia', 'amelia27@example.com', '090912345670', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345777', NULL, '1992-08-08', '2024-02-05 15:32:06', 3003),
(90, 'Elijah', 'elijah28@example.com', '091512345678', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345778', NULL, '1992-09-09', '2024-02-05 15:32:06', 3001),
(91, 'Charlotte', 'charlotte29@example.com', '091512345677', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345779', NULL, '1992-10-10', '2024-02-05 15:32:06', 3002),
(92, 'Mason', 'mason200@example.com', '091512347876', '$2y$10$abcdefghijklmnopqrstuvwx.yz012347870', NULL, '1992-12-30', '2024-02-05 15:32:06', 3003),
(93, 'Aria', 'aria201@example.com', '091512345675', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1992-12-31', '2024-02-05 15:32:06', 3001),
(94, 'Jackson', 'jackson202@example.com', '091512345674', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1993-01-01', '2024-02-05 15:32:06', 3002),
(95, 'Ella', 'ella300@example.com', '091512345673', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1993-12-31', '2024-02-05 15:32:06', 3003),
(96, 'Liam', 'liam301@example.com', '090912345780', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345571', NULL, '1992-01-01', '2024-02-05 15:32:06', 3001),
(97, 'Olivia', 'olivia302@example.com', '090912345571', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345572', NULL, '1992-02-02', '2024-02-05 15:32:06', 3002),
(98, 'Noah', 'noah303@example.com', '090912345572', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345573', NULL, '1992-03-03', '2024-02-05 15:32:06', 3003),
(99, 'Emma', 'emma304@example.com', '090912345573', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1992-04-04', '2024-02-05 15:32:06', 3001),
(100, 'Oliver', 'oliver305@example.com', '090912344674', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1992-05-05', '2024-02-05 15:32:06', 3002),
(101, 'Ava', 'ava306@example.com', '090912445675', '$2y$10$abcdefghijklmnopqrstuvwx.yz012344676', NULL, '1992-06-06', '2024-02-05 15:32:06', 3003),
(102, 'Ethan', 'ethan307@example.com', '090902345676', '$2y$10$abcdefghijklmnopqrstuvwx.yz012344677', NULL, '1992-07-07', '2024-02-05 15:32:06', 3001),
(103, 'Harper', 'harper308@example.com', '090902345677', '$2y$10$abcdefghijklmnopqrstuvwx.yz012344678', NULL, '1992-08-08', '2024-02-05 15:32:06', 3002),
(104, 'Amelia', 'amelia309@example.com', '090902345678', '$2y$10$abcdefghijklmnopqrstuvwx.yz012344679', NULL, '1992-09-09', '2024-02-05 15:32:06', 3003),
(105, 'Elijah', 'elijah310@example.com', '091512344610', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1992-10-10', '2024-02-05 15:32:06', 3001),
(106, 'Charlotte', 'charlotte311@example.com', '091512345611', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1992-11-11', '2024-02-05 15:32:06', 3002),
(107, 'Mason', 'mason312@example.com', '091513345612', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1992-12-12', '2024-02-05 15:32:06', 3003),
(108, 'Aria', 'aria313@example.com', '091513345613', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1992-12-13', '2024-02-05 15:32:06', 3001),
(109, 'Jackson', 'jackson314@example.com', '091513345614', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1992-12-14', '2024-02-05 15:32:06', 3002),
(110, 'Ella', 'ella315@example.com', '091513345615', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1992-12-15', '2024-02-05 15:32:06', 3003),
(111, 'Sophia', 'sophia400@example.com', '091513345616', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345676', NULL, '1992-12-16', '2024-02-05 15:32:06', 3001),
(112, 'Logan', 'logan401@example.com', '091513345617', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345677', NULL, '1992-12-17', '2024-02-05 15:32:06', 3002),
(113, 'Aiden', 'aiden402@example.com', '091513345618', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1992-12-18', '2024-02-05 15:32:06', 3003),
(114, 'Mia', 'mia403@example.com', '091513345619', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1992-12-19', '2024-02-05 15:32:06', 3001),
(115, 'Lucas', 'lucas404@example.com', '091513345620', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1992-12-20', '2024-02-05 15:32:06', 3002),
(116, 'Isabella', 'isabella405@example.com', '091513345621', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1992-12-21', '2024-02-05 15:32:06', 3003),
(117, 'Evelyn', 'evelyn406@example.com', '091513345622', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1992-12-22', '2024-02-05 15:32:06', 3001),
(118, 'Jack', 'jack407@example.com', '091512345623', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1992-12-23', '2024-02-05 15:32:06', 3002),
(119, 'Avery', 'avery408@example.com', '091512345624', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1992-12-24', '2024-02-05 15:32:06', 3003),
(120, 'Sebastian', 'sebastian409@example.com', '091512345625', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1992-12-25', '2024-02-05 15:32:06', 3001),
(121, 'Aubrey', 'aubrey410@example.com', '091512345626', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345676', NULL, '1992-12-26', '2024-02-05 15:32:06', 3002),
(122, 'Camila', 'camila411@example.com', '091512345627', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345677', NULL, '1992-12-27', '2024-02-05 15:32:06', 3003),
(123, 'Grayson', 'grayson412@example.com', '091512345628', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1992-12-28', '2024-02-05 15:32:06', 3001),
(124, 'Scarlett', 'scarlett413@example.com', '091512345629', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1992-12-29', '2024-02-05 15:32:06', 3002),
(125, 'Carter', 'carter414@example.com', '091512345630', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1992-12-30', '2024-02-05 15:32:06', 3003),
(126, 'Madison', 'madison415@example.com', '091512345631', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1992-12-31', '2024-02-05 15:32:06', 3001),
(127, 'Ethan', 'ethan416@example.com', '091512345632', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1993-01-01', '2024-02-05 15:32:06', 3002),
(128, 'Lily', 'lily417@example.com', '091512345633', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1993-01-02', '2024-02-05 15:32:06', 3003),
(129, 'Chloe', 'chloe500@example.com', '091512345634', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1993-01-03', '2024-02-05 15:32:06', 3001),
(130, 'Daniel', 'daniel501@example.com', '091512345635', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1993-01-04', '2024-02-05 15:32:06', 3002),
(131, 'Hazel', 'hazel502@example.com', '091512345636', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345676', NULL, '1993-01-05', '2024-02-05 15:32:06', 3003),
(132, 'Liam', 'liam501@example.com', '091512345701', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1993-01-06', '2024-02-05 15:32:06', 3001),
(133, 'Emma', 'emma502@example.com', '091512345702', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1993-01-07', '2024-02-05 15:32:06', 3002),
(134, 'Oliver', 'oliver503@example.com', '091512345703', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1993-01-08', '2024-02-05 15:32:06', 3003),
(135, 'Ava', 'ava504@example.com', '091512345704', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1993-01-09', '2024-02-05 15:32:06', 3001),
(136, 'Noah', 'noah505@example.com', '091512345705', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1993-01-10', '2024-02-05 15:32:06', 3002),
(137, 'Sophia', 'sophia506@example.com', '0915123457', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1993-01-11', '2024-02-05 15:32:06', 3003),
(138, 'Jackson', 'jackson507@example.com', '091512345707', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1993-01-12', '2024-02-05 15:32:06', 3001),
(139, 'Aria', 'aria508@example.com', '091512345708', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1993-01-13', '2024-02-05 15:32:06', 3002),
(140, 'Lucas', 'lucas509@example.com', '091512345709', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345676', NULL, '1993-01-14', '2024-02-05 15:32:06', 3003),
(141, 'Amelia', 'amelia510@example.com', '091512345710', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345677', NULL, '1993-01-15', '2024-02-05 15:32:06', 3001),
(142, 'Elijah', 'elijah511@example.com', '091512345711', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1993-01-16', '2024-02-05 15:32:06', 3002),
(143, 'Aiden', 'aiden512@example.com', '091512345712', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345679', NULL, '1993-01-17', '2024-02-05 15:32:06', 3003),
(144, 'Scarlett', 'scarlett513@example.com', '091512345713', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345670', NULL, '1993-01-18', '2024-02-05 15:32:06', 3001),
(145, 'Mason', 'mason514@example.com', '091512345714', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345671', NULL, '1993-01-19', '2024-02-05 15:32:06', 3002),
(146, 'Lily', 'lily515@example.com', '091512345715', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345672', NULL, '1993-01-20', '2024-02-05 15:32:06', 3003),
(147, 'Ethan', 'ethan516@example.com', '091512345716', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345673', NULL, '1993-01-21', '2024-02-05 15:32:06', 3001),
(148, 'Harper', 'harper517@example.com', '091512345717', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345674', NULL, '1993-01-22', '2024-02-05 15:32:06', 3002),
(149, 'Avery', 'avery518@example.com', '091512345718', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345675', NULL, '1993-01-23', '2024-02-05 15:32:06', 3003),
(150, 'Evelyn', 'evelyn600@example.com', '091512345719', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345676', NULL, '1993-01-24', '2024-02-05 15:32:06', 3001),
(151, 'Logan', 'logan601@example.com', '091512345720', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345677', NULL, '1993-01-25', '2024-02-05 15:32:06', 3002),
(152, 'Zoey', 'zoey602@example.com', '091512345721', '$2y$10$abcdefghijklmnopqrstuvwx.yz012345678', NULL, '1993-01-26', '2024-02-05 15:32:06', 3003);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mb_team_member`
--
ALTER TABLE `mb_team_member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_permission_id` (`fk_permission_id`);

--
-- Indexes for table `mb_user`
--
ALTER TABLE `mb_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `fk_skin_id` (`fk_skin_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mb_team_member`
--
ALTER TABLE `mb_team_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `mb_user`
--
ALTER TABLE `mb_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
