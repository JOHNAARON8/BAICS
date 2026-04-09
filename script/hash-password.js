const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function hashPasswords() {
    let connection;
    
    try {
        // Create database connection using your .env settings
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connected to database successfully!\n');
        
        // Define users with their real passwords
        const users = [
            { username: 'admin', plainPassword: 'admin123', role: 'admin' },
            { username: 'superadmin', plainPassword: 'super123', role: 'super-admin' },
            { username: 'officehead', plainPassword: 'head123', role: 'office-head' }
        ];
        
        console.log('🔐 Hashing passwords with bcrypt...\n');
        
        // Update each user with bcrypt hashed password
        for (const user of users) {
            // Generate bcrypt hash (10 rounds)
            const hashedPassword = await bcrypt.hash(user.plainPassword, 10);
            
            // Update the user's password in database
            const [result] = await connection.execute(
                'UPDATE users SET password = ? WHERE username = ?',
                [hashedPassword, user.username]
            );
            
            if (result.affectedRows > 0) {
                console.log(`✅ Updated: ${user.username} (${user.role})`);
                console.log(`   Hash: ${hashedPassword.substring(0, 30)}...\n`);
            } else {
                console.log(`❌ User not found: ${user.username}`);
            }
        }
        
        // Verify the updates
        console.log('\n📊 Verifying database entries:');
        const [rows] = await connection.execute(
            'SELECT id, username, role, LEFT(password, 30) as password_preview, status FROM users'
        );
        
        console.table(rows);
        
        console.log('\n✅ All passwords have been hashed with bcrypt!');
        console.log('\n📋 Test Credentials:');
        console.log('┌─────────────┬──────────────┬─────────────────┐');
        console.log('│ Role        │ Username     │ Password        │');
        console.log('├─────────────┼──────────────┼─────────────────┤');
        console.log('│ Admin       │ admin        │ admin123        │');
        console.log('│ Super Admin │ superadmin   │ super123        │');
        console.log('│ Office Head │ officehead   │ head123         │');
        console.log('└─────────────┴──────────────┴─────────────────┘');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nMake sure your database credentials in .env are correct:');
        console.error(`DB_HOST=${process.env.DB_HOST}`);
        console.error(`DB_USER=${process.env.DB_USER}`);
        console.error(`DB_NAME=${process.env.DB_NAME}`);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed.');
        }
    }
}

// Run the script
hashPasswords();