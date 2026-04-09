const express = require('express');
const router = express.Router();
const db = require('../db');
const SuperAdminController = require('../Controllers/superAdminController');
const { ensureAuth, checkRole } = require('../Middleware/auth');

// Login routes
router.get('/super-admin-login', SuperAdminController.showLogin);
router.post('/super-admin-login', SuperAdminController.login);
router.get('/super-admin-logout', SuperAdminController.logout);

// Dashboard (protected)
router.get('/dashboard', ensureAuth, checkRole('super-admin'), (req, res) => {
    res.render('super-admin/dashboard', { user: req.session.user });
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