const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
    let connection;
    
    try {
        // First connect without database to create it if needed
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306
        });
        
        // Create database if not exists
        await connection.execute(
            `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
        );
        console.log(`✅ Database '${process.env.DB_NAME}' ready`);
        
        // Connect to the database
        await connection.changeUser({ database: process.env.DB_NAME });
        
        // Create users table if not exists
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'super-admin', 'office-head') NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table ready\n');
        
        // Check if users exist
        const [existing] = await connection.execute('SELECT COUNT(*) as count FROM users');
        
        if (existing[0].count === 0) {
            console.log('📝 Inserting default users...');
            
            // Hash passwords
            const adminHash = await bcrypt.hash('admin123', 10);
            const superHash = await bcrypt.hash('super123', 10);
            const headHash = await bcrypt.hash('head123', 10);
            
            // Insert users
            await connection.execute(`
                INSERT INTO users (username, password, role) VALUES 
                ('admin', ?, 'admin'),
                ('superadmin', ?, 'super-admin'),
                ('officehead', ?, 'office-head')
            `, [adminHash, superHash, headHash]);
            
            console.log('✅ Default users created with bcrypt hashed passwords\n');
        } else {
            console.log('📝 Updating existing users with bcrypt hashes...');
            
            // Update existing users
            const adminHash = await bcrypt.hash('admin123', 10);
            const superHash = await bcrypt.hash('super123', 10);
            const headHash = await bcrypt.hash('head123', 10);
            
            await connection.execute(
                'UPDATE users SET password = ? WHERE username = "admin"',
                [adminHash]
            );
            await connection.execute(
                'UPDATE users SET password = ? WHERE username = "superadmin"',
                [superHash]
            );
            await connection.execute(
                'UPDATE users SET password = ? WHERE username = "officehead"',
                [headHash]
            );
            
            console.log('✅ Existing users updated with bcrypt hashes\n');
        }
        
        // Show final users
        const [users] = await connection.execute(
            'SELECT id, username, role, status, LEFT(password, 30) as hash_preview FROM users'
        );
        
        console.log('📊 Current Users:');
        console.table(users);
        
        console.log('\n✅ Initialization complete!');
        console.log('\n🔐 Test Credentials:');
        console.log('   Admin:       admin / admin123');
        console.log('   Super Admin: superadmin / super123');
        console.log('   Office Head: officehead / head123');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

// Run the initialization
initDatabase();