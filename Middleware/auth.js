module.exports = {
    // Protect routes that require login
    ensureAuth: (req, res, next) => {
        if (req.session.user) return next();
        res.redirect('/login');
    },

    // Protect login page if already logged in
    ensureGuest: (req, res, next) => {
        if (!req.session.user) return next();
        switch(req.session.user.role) {
            case 'admin': return res.redirect('/admin/dashboard');
            case 'super-admin': return res.redirect('/super-admin/dashboard');
            case 'office-head': return res.redirect('/office-head/dashboard');
            default: return res.redirect('/login');
        }
    },

    // Role-based access
    checkRole: (role) => {
        return (req, res, next) => {
            if (req.session.user && req.session.user.role === role) return next();
            res.status(403).render('error', {
                message: 'Access Denied',
                user: req.session.user || null
            });
        };
    }
};