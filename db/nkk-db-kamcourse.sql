-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Oct 06, 2017 at 01:46 AM
-- Server version: 5.6.36-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nkk-db-kamcourse`
--

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_class`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_class` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_course` varchar(100) NOT NULL,
  `class_schedule` varchar(100) NOT NULL,
  `class_facilitator` varchar(100) NOT NULL,
  `class_start_date` date NOT NULL,
  `class_duration` varchar(10) NOT NULL,
  `class_fee` int(11) NOT NULL,
  `class_description` varchar(255) NOT NULL,
  `class_media` varchar(100) NOT NULL,
  `class_video` varchar(100) NOT NULL,
  `class_status` varchar(10) NOT NULL,
  `class_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_course`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) NOT NULL,
  `course_summary` varchar(255) NOT NULL,
  `course_category` varchar(50) NOT NULL,
  `course_outline` text NOT NULL,
  `course_duration` varchar(50) NOT NULL,
  `course_fee` int(11) NOT NULL,
  `course_media` varchar(100) NOT NULL,
  `course_video` varchar(100) NOT NULL,
  `course_create_date` datetime NOT NULL,
  `course_update_date` datetime NOT NULL,
  `course_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `kc_tbl_course`
--

INSERT INTO `kc_tbl_course` (`course_id`, `course_name`, `course_summary`, `course_category`, `course_outline`, `course_duration`, `course_fee`, `course_media`, `course_video`, `course_create_date`, `course_update_date`, `course_other_info`) VALUES
(1, 'Visual Basic', 'Visual Basic is a third-generation event-driven programming language and integrated development environment (IDE) from Microsoft for its Component Object Model (COM) programming model first released in 1991 and declared legacy during 2008.', 'Computer Science', 'Outline Visual Basic is a third-generation event-driven programming language and integrated development environment (IDE) from Microsoft for its Component Object Model (COM) programming model first released in 1991 and declared legacy during 2008', '3', 75, '', '', '2017-09-26 00:00:00', '2017-09-26 00:00:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_course_category`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_course_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `category_description` varchar(255) NOT NULL,
  `category_media` varchar(100) NOT NULL,
  `category_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_course_schedule`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_course_schedule` (
  `schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_time` varchar(100) NOT NULL,
  `schedule_description` varchar(255) NOT NULL,
  `schedule_media` varchar(100) NOT NULL,
  `schedule_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`schedule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_facilitator`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_facilitator` (
  `facilitator_id` int(11) NOT NULL AUTO_INCREMENT,
  `facilitator_firstname` varchar(50) NOT NULL,
  `facilitator_lastname` varchar(50) NOT NULL,
  `facilitator_phone` varchar(50) NOT NULL,
  `facilitator_email` varchar(50) NOT NULL,
  `facilitator_sex` varchar(10) NOT NULL,
  `facilitator_media` varchar(100) NOT NULL,
  `facilitator_address` varchar(100) NOT NULL,
  `facilitator_profile` text NOT NULL,
  `facilitator_via_platform` varchar(50) NOT NULL,
  `facilitator_create_date` datetime NOT NULL,
  `facilitator_update_date` datetime NOT NULL,
  `facilitator_active_date` datetime NOT NULL,
  `facilitator_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`facilitator_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_student`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_firstname` varchar(50) NOT NULL,
  `student_lastname` varchar(50) NOT NULL,
  `student_phone` varchar(50) NOT NULL,
  `student_email` varchar(50) NOT NULL,
  `student_sex` varchar(10) NOT NULL,
  `student_media` varchar(100) NOT NULL,
  `student_address` varchar(100) NOT NULL,
  `student_via_platform` varchar(50) NOT NULL,
  `student_create_date` datetime NOT NULL,
  `student_update_date` datetime NOT NULL,
  `student_active_date` datetime NOT NULL,
  `student_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `kc_tbl_student_history`
--

CREATE TABLE IF NOT EXISTS `kc_tbl_student_history` (
  `history_id` int(11) NOT NULL AUTO_INCREMENT,
  `history_student_id` int(11) NOT NULL,
  `history_class_id` int(11) NOT NULL,
  `history_enroll_date` date NOT NULL,
  `history_status` varchar(50) NOT NULL,
  `history_other_info` varchar(255) NOT NULL,
  PRIMARY KEY (`history_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
