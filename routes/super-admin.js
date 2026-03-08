const express = require('express');
const router = express.Router();

// Super Admin Dashboard
router.get('/dashboard', (req, res) => {
    res.render('super-admin/dashboard', {
        title: 'Super Admin Dashboard',
        pageTitle: 'Dashboard',
        currentPage: 'dashboard',
        user: req.session.user,
        role: 'super-admin'
    });
});

// User Management
router.get('/users', (req, res) => {
    res.render('super-admin/users', {
        title: 'User Management',
        pageTitle: 'User Management',
        currentPage: 'users',
        user: req.session.user,
        role: 'super-admin'
    });
});


//admin logs
router.get('/admin-logs', (req, res) => {
    res.render('super-admin/admin-logs', {
        title: 'Admin Logs',
        pageTitle: 'Admin Logs',
        currentPage: 'logs',
        user: req.session.user,
        role: 'super-admin'
    });
});

//system backups
router.get('/system-backup', (req, res) => {
    res.render('super-admin/system-backup', {
        title: 'System Backup',
        pageTitle: 'System Backup',
        currentPage: 'system-backup',
        user: req.session.user,
        role: 'super-admin'
    });
});

//settings
router.get('/settings', (req, res) => {
    res.render('super-admin/settings', {
        title: 'Settings',
        pageTitle: 'Settings',
        currentPage: 'settings',
        user: req.session.user,
        role: 'super-admin'
    });
});

//support
router.get('/support', (req, res) => {
    res.render('super-admin/support', {
        title: 'Support',
        pageTitle: 'Support',
        currentPage: 'support',
        user: req.session.user,
        role: 'super-admin'
    });
});

module.exports = router;