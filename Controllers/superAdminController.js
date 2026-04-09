const User = require('../Models/userModel');
const bcrypt = require('bcrypt');

const SuperAdminController = {
    showLogin: (req, res) => {
        res.render('super-admin-login', { error: null });
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findSuperAdminByUsername(username);
            
            if (!user) {
                return res.render('super-admin-login', { error: 'Invalid super admin credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('super-admin-login', { error: 'Invalid super admin credentials' });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            res.redirect('/super-admin/dashboard');

        } catch (error) {
            console.error(error);
            res.render('super-admin-login', { error: 'Server error occurred' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) console.error(err);
            res.redirect('/super-admin/super-admin-login');
        });
    }
};

module.exports = SuperAdminController;