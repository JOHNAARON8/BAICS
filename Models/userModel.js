const db = require('../db');

const User = {
    // Generic find by username
    async findByUsername(username) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND status = "active"',
            [username]
        );
        return rows[0];
    },

    // Role-specific find methods
    async findAdminByUsername(username) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND role = "admin" AND status = "active"',
            [username]
        );
        return rows[0];
    },

    async findSuperAdminByUsername(username) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND role = "super-admin" AND status = "active"',
            [username]
        );
        return rows[0];
    },

    async findOfficeHeadByUsername(username) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ? AND role = "office-head" AND status = "active"',
            [username]
        );
        return rows[0];
    }
};

module.exports = User;