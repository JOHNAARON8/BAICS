    const User = require('../Models/userModel');
    const bcrypt = require('bcrypt');

    const AuthController = {
        // Show login page
        showLogin: (req, res) => {
            res.render('login', { error: null, user: null });
        },

        // Handle login
        login: async (req, res) => {
            const { username, password } = req.body;

            try {
                const user = await User.findByUsername(username);
                if (!user) {
                    return res.render('login', { error: 'Invalid credentials', user: null });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.render('login', { error: 'Invalid credentials', user: null });
                }

                // Save session
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    department: user.department
                };

                // Redirect based on role
                switch(user.role) {
                    case 'admin': return res.redirect('/admin/dashboard');
                    case 'super-admin': return res.redirect('/super-admin/dashboard');
                    case 'office-head': return res.redirect('/office-head/dashboard');
                    default: return res.redirect('/login');
                }

            } catch (error) {
                console.error(error);
                res.render('login', { error: 'Server error', user: null });
            }
        },

        // Handle logout
        logout: (req, res) => {
            req.session.destroy(err => {
                if (err) console.error(err);
                res.redirect('/login');
            });
        }
    };

    module.exports = AuthController;