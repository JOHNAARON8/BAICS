const User = require('../Models/userModel');
const bcrypt = require('bcrypt');

const AdminController = {
    showLogin: (req, res) => {
        res.render('admin-login', { error: null });
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findAdminByUsername(username);
            
            if (!user) {
                return res.render('admin-login', { error: 'Invalid admin credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('admin-login', { error: 'Invalid admin credentials' });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            res.redirect('/admin/dashboard');

        } catch (error) {
            console.error(error);
            res.render('admin-login', { error: 'Server error occurred' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) console.error(err);
            res.redirect('/admin/admin-login');
        });
    }
};

module.exports = AdminController;