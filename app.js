const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

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
    cookie: { secure: false } // set to true if using https
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
        return res.redirect('/login');
    }
    next();
};

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).render('error', { 
                message: 'Access Denied',
                user: req.session.user 
            });
        }
    };
};

// ============================================================================
// HOME ROUTE
// ============================================================================
app.get('/', (req, res) => {
    if (req.session.user) {
        switch(req.session.user.role) {
            case 'admin':
                res.redirect('/admin/dashboard');
                break;
            case 'super-admin':
                res.redirect('/super-admin/dashboard');
                break;
            case 'office-head':
                res.redirect('/office-head/dashboard');
                break;
            default:
                res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

// ============================================================================
// ROLE SELECTION PAGE
// ============================================================================
app.get('/login', (req, res) => {
    res.render('login', { 
        error: null,
        user: null 
    });
});

// ============================================================================
// INDIVIDUAL LOGIN PAGES
// ============================================================================
app.get('/admin-login', (req, res) => {
    res.render('admin-login', { 
        error: null,
        user: null 
    });
});

app.get('/super-admin-login', (req, res) => {
    res.render('super-admin-login', { 
        error: null,
        user: null 
    });
});

app.get('/office-head-login', (req, res) => {
    res.render('office-head-login', { 
        error: null,
        user: null 
    });
});

// ============================================================================
// LOGIN HANDLERS
// ============================================================================
// Admin Login Handler
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    
    // Demo credentials
    if (username === 'admin' && password === 'admin123') {
        req.session.user = {
            id: Date.now(),
            username: 'admin',
            name: 'Admin User',
            role: 'admin',
            department: 'Dept. Oversight'
        };
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin-login', { 
            error: 'Invalid admin credentials',
            user: null 
        });
    }
});

// Super Admin Login Handler
app.post('/super-admin-login', (req, res) => {
    const { username, password } = req.body;
    
    // Demo credentials
    if (username === 'superadmin' && password === 'super123') {
        req.session.user = {
            id: Date.now(),
            username: 'superadmin',
            name: 'Super Admin',
            role: 'super-admin',
            department: 'System Management'
        };
        res.redirect('/super-admin/dashboard');
    } else {
        res.render('super-admin-login', { 
            error: 'Invalid super admin credentials',
            user: null 
        });
    }
});

// Office Head Login Handler
app.post('/office-head-login', (req, res) => {
    const { username, password } = req.body;
    
    // Demo credentials
    if (username === 'officehead' && password === 'head123') {
        req.session.user = {
            id: Date.now(),
            username: 'officehead',
            name: 'Office Head',
            role: 'office-head',
            department: 'Department Office'
        };
        res.redirect('/office-head/dashboard');
    } else {
        res.render('office-head-login', { 
            error: 'Invalid office head credentials',
            user: null 
        });
    }
});

// ============================================================================
// LOGOUT
// ============================================================================
app.get('/admin-logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin-login');
});


app.get('/super-admin-logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/super-admin-login');
})

app.get('/office-head-logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/office-head-login');
})

// ============================================================================
// PROTECTED ROUTES
// ============================================================================
app.use('/admin', checkAuth, checkRole('admin'), adminRoutes);
app.use('/super-admin', checkAuth, checkRole('super-admin'), superAdminRoutes);
app.use('/office-head', checkAuth, checkRole('office-head'), officeHeadRoutes);

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
    console.log(`BAICS System running on port ${PORT}`);
    console.log(`Admin Login: http://localhost:${PORT}/admin-login`);
    console.log(`Super Admin Login: http://localhost:${PORT}/super-admin-login`);
    console.log(`Office Head Login: http://localhost:${PORT}/office-head-login`);
});