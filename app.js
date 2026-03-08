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
// Setting up the usual suspects - body parser to handle form data and JSON
// Also telling Express where to find our static files (CSS, images, etc.)
// ============================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// SESSION CONFIGURATION
// ============================================================================
// Gotta keep track of who's who while they browse the site
// Using sessions so users don't have to log in on every single page
// Note: secure: false is fine for development, but change to true in production with HTTPS
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
// EJS it is! Makes it easy to inject dynamic data into our HTML
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// ROUTE IMPORTS
// ============================================================================
// Breaking down routes by user role - keeps things organized
// Each type of user has their own set of routes and permissions
// ============================================================================
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/super-admin');
const officeHeadRoutes = require('./routes/office-head');

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
// Quick check to see if someone's actually logged in
// If not, straight to the login page with them!
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
// Making sure users can only access what they're supposed to
// Admins do admin things, office heads do office head things, you get the idea
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
// If you're logged in, we'll send you to your dashboard
// If not, login page it is. Simple as that.
// ============================================================================
app.get('/', (req, res) => {
    if (req.session.user) {
        // Redirect to appropriate dashboard based on role
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
// LOGIN PAGE
// ============================================================================
// Show the login form - nice and simple for now
// ============================================================================
app.get('/login', (req, res) => {
    res.render('login', { 
        error: null,
        user: null 
    });
});

// ============================================================================
// LOGIN HANDLER
// ============================================================================
// This is where the magic happens - checking credentials and logging people in
// TODO: Replace this hardcoded stuff with a real database! This is just for testing
// ============================================================================
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;
    
    // Simple authentication logic (replace with database in production)
    // This is just for demonstration
    const users = {
        admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', dept: 'Dept. Oversight' },
        'super-admin': { username: 'superadmin', password: 'super123', role: 'super-admin', name: 'Super Admin', dept: 'System Management' },
        'office-head': { username: 'officehead', password: 'head123', role: 'office-head', name: 'Office Head', dept: 'Department Office' }
    };

    const user = users[role];
    
    if (user && username === user.username && password === user.password) {
        req.session.user = {
            id: Date.now(),
            username: user.username,
            name: user.name,
            role: user.role,
            department: user.dept
        };
        
        // Redirect based on role
        switch(user.role) {
            case 'admin':
                res.redirect('/admin/dashboard');
                break;
            case 'super-admin':
                res.redirect('/super-admin/dashboard');
                break;
            case 'office-head':
                res.redirect('/office-head/dashboard');
                break;
        }
    } else {
        res.render('login', { 
            error: 'Invalid credentials',
            user: null 
        });
    }
});

// ============================================================================
// LOGOUT
// ============================================================================
// Bye bye! See you next time. Destroy the session and send 'em back to login
// ============================================================================
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ============================================================================
// PROTECTED ROUTES
// ============================================================================
// These routes require both authentication AND the correct role
// Order matters: checkAuth first, then checkRole
// ============================================================================
app.use('/admin', checkAuth, checkRole('admin'), adminRoutes);
app.use('/super-admin', checkAuth, checkRole('super-admin'), superAdminRoutes);
app.use('/office-head', checkAuth, checkRole('office-head'), officeHeadRoutes);

// ============================================================================
// 404 HANDLER
// ============================================================================
// Oops! Someone's trying to go somewhere that doesn't exist
// Show them a friendly error page instead of just breaking
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
// Everything's set up, let's get this party started!
// ============================================================================
app.listen(PORT, () => {
    console.log(`BAICS System running on port ${PORT}`);
});