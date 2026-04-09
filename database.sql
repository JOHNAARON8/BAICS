CREATE DATABASE Elective3_FinalProject;
USE Elective3_FinalProject;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super-admin', 'office-head') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role)
VALUES 
('admin', 'admin123', 'admin'),
('superadmin', 'super123', 'super-admin'),
('officehead', 'head123', 'office-head')