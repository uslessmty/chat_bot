CREATE DATABASE IF NOT EXISTS chatbot;
USE chatbot;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chat_windows` (
  `window_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `avatar` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chats` (
  `chat_id` INT AUTO_INCREMENT PRIMARY KEY,
  `window_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `user_message` TEXT,
  `avatar_response` TEXT,
  FOREIGN KEY (`window_id`) REFERENCES `chat_windows`(`window_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;