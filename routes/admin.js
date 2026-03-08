const express = require('express');
const router = express.Router();

// Admin Dashboard
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        pageTitle: 'Dashboard',
        currentPage: 'dashboard',
        user: req.session.user,
        role: 'admin'
    });
});

// Survey Management
router.get('/survey-management', (req, res) => {
    res.render('admin/survey-management', {
        title: 'Survey Management',
        pageTitle: 'Survey Management',
        currentPage: 'survey-management',
        user: req.session.user,
        role: 'admin'
    });
});

// Responses
router.get('/responses', (req, res) => {
    res.render('admin/responses', {
        title: 'Responses',
        pageTitle: 'Responses',
        currentPage: 'responses',
        user: req.session.user,
        role: 'admin'
    });
});

// Monitoring
router.get('/monitoring', (req, res) => {
    res.render('admin/monitoring', {
        title: 'Monitoring',
        pageTitle: 'Monitoring',
        currentPage: 'monitoring',
        user: req.session.user,
        role: 'admin'
    });
});

// Reports
router.get('/reports', (req, res) => {
    res.render('admin/reports', {
        title: 'Reports',
        pageTitle: 'Reports',
        currentPage: 'reports',
        user: req.session.user,
        role: 'admin'
    });
});

    // Survey Creation
    router.get('/survey-create', (req, res) => {
        res.render('admin/survey-create', {
            title: 'Create Survey',
            pageTitle: 'Create Survey',
            currentPage: 'survey-management',
            user: req.session.user,
            role: 'admin'
        });
    });

    // Office Head Management
router.get('/office-heads', (req, res) => {
    res.render('admin/office-heads', {
        title: 'Office Head Management',
        pageTitle: 'Office Head Management',
        currentPage: 'office-heads',
        user: req.session.user,
        role: 'admin'
    });
});

//settings
router.get('/settings', (req, res) => {
    res.render('admin/settings', {
        title: 'Settings',
        pageTitle: 'Settings',
        currentPage: 'settings',
        user: req.session.user,
        role: 'admin'
    });
});

//support
router.get('/support', (req, res) => {
    res.render('admin/support', {
        title: 'Support',
        pageTitle: 'Support',
        currentPage: 'support',
        user: req.session.user,
        role: 'admin'
    });
});

module.exports = router;