USE `essentialmode`;

CREATE TABLE IF NOT EXISTS `jsfour_confiscateditems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `dob` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `date` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `uploader` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `items` longtext COLLATE utf8mb4_bin,
  `count` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `jsfour_forum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8mb4_bin DEFAULT 'post',
  `text` longtext COLLATE utf8mb4_bin,
  `username` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `date` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `job` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `jsfour_medicalrecords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `dob` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `date` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `uploader` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `text` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
);

CREATE TABLE `jsfour_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `group` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `job` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_bin DEFAULT 'https://via.placeholder.com/50?text=A',
  `desktop` varchar(255) COLLATE utf8mb4_bin DEFAULT 'assets/images/windows.png',
  `email` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);

INSERT INTO `jsfour_users` (`username`, `password`, `firstname`, `lastname`, `group`, `job`, `avatar`, `desktop`) VALUES ('admin', 'admin', 'admin', 'admin', 'admin', 'all', 'https://via.placeholder.com/50x50', 'assets/images/windows.png');

CREATE TABLE `jsfour_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `text` longtext COLLATE utf8mb4_bin,
  `title` varchar(255) COLLATE utf8mb4_bin DEFAULT 'Title',
  `image` varchar(255) COLLATE utf8mb4_bin DEFAULT 'https://via.placeholder.com/50/FFFFFFF/?text=JOB',
  PRIMARY KEY (`id`)
);

# REMOVE # DOWN BELOW IF YOU HAVE ESX_JOBS INSTALLED
# INSERT INTO `jsfour_jobs` (`group`, `name`) SELECT `name`, `label` FROM `jobs` WHERE `name` != 'unemployed' OR `whitelisted` = 1;
