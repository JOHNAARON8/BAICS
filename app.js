const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// SESSION CONFIGURATION
// ============================================================================
app.use(session({
    secret: process.env.SESSION_SECRET || 'baics-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,  // Set to true if using HTTPS
        maxAge: 3600000 // Session expires after 1 hour
    }
}));

// ============================================================================
// VIEW ENGINE SETUP
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// ROUTE IMPORTS
// ============================================================================
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/super-admin');
const officeHeadRoutes = require('./routes/office-head');

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        // Redirect to role-specific login page
        if (req.originalUrl.startsWith('/admin')) {
            return res.redirect('/admin/login');
        } else if (req.originalUrl.startsWith('/super-admin')) {
            return res.redirect('/super-admin/login');
        } else if (req.originalUrl.startsWith('/office-head')) {
            return res.redirect('/office-head/login');
        }
        return res.redirect('/');
    }
    next();
};

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).render('error', { 
                message: 'Access Denied - You do not have permission to access this page',
                user: req.session.user || null 
            });
        }
    };
};

// ============================================================================
// HOME / ROLE SELECTION PAGE
// ============================================================================
app.get('/', (req, res) => {
    // If already logged in, redirect to respective dashboard
    if (req.session.user) {
        switch(req.session.user.role) {
            case 'admin':
                return res.redirect('/admin/dashboard');
            case 'super-admin':
                return res.redirect('/super-admin/dashboard');
            case 'office-head':
                return res.redirect('/office-head/dashboard');
            default:
                return res.redirect('/');
        }
    }
    // Show role selection page
    res.render('role-selection', { user: null });
});

// ============================================================================
// ROLE-SPECIFIC ROUTES (Each handles their own login)
// ============================================================================
app.use('/admin', adminRoutes);
app.use('/super-admin', superAdminRoutes);
app.use('/office-head', officeHeadRoutes);

// ============================================================================
// 404 HANDLER
// ============================================================================
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found',
        user: req.session.user || null 
    });
});

// ============================================================================
// START THE SERVER
// ============================================================================
app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`BAICS System running on port http://localhost:${PORT}`);
    console.log(`=================================`);
    console.log(`\nLogin Portals:`);
    console.log(`Admin Portal:       http://localhost:${PORT}/admin/admin-login`);
    console.log(`Super Admin Portal: http://localhost:${PORT}/super-admin/super-login`);
    console.log(`Office Head Portal: http://localhost:${PORT}/office-head/office-head-login`);
    console.log(`\nRole Selection:     http://localhost:${PORT}/`);
    console.log(`=================================\n`);
});