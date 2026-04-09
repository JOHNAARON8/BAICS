const User = require('../Models/userModel');
const bcrypt = require('bcrypt');

const OfficeHeadController = {
    showLogin: (req, res) => {
        res.render('office-head-login', { error: null });
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOfficeHeadByUsername(username);
            
            if (!user) {
                return res.render('office-head-login', { error: 'Invalid office head credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('office-head-login', { error: 'Invalid office head credentials' });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            res.redirect('/office-head/dashboard');

        } catch (error) {
            console.error(error);
            res.render('office-head-login', { error: 'Server error occurred' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) console.error(err);
            res.redirect('/office-head/office-head-login');
        });
    }
};

module.exports = OfficeHeadController;