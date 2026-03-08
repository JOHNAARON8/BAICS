const express = require('express');
const router = express.Router();
const multer = require('multer'); // For file uploads
const path = require('path');

// Configure multer for file uploads (optional - install with: npm install multer)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images, PDFs, and DOC files are allowed'));
        }
    }
});

// Office Head Dashboard
router.get('/dashboard', (req, res) => {
    res.render('office-head/dashboard', {
        title: 'Office Head Dashboard',
        pageTitle: 'Dashboard',
        currentPage: 'dashboard',
        user: req.session.user,
        role: 'office-head'
    });
});

// My Surveys
router.get('/my-surveys', (req, res) => {
    const filter = req.query.filter || 'active';
    res.render('office-head/my-surveys', {
        title: 'My Surveys',
        pageTitle: 'My Surveys',
        currentPage: 'my-surveys',
        user: req.session.user,
        role: 'office-head',
        filter: filter
    });
});

// Survey Form (for continuing or starting a survey)
router.get('/survey/:id', (req, res) => {
    const surveyId = req.params.id;
    // In production, fetch survey data from database based on ID
    res.render('office-head/survey-form', {
        title: 'Complete Survey',
        pageTitle: 'Complete Survey',
        currentPage: 'my-surveys',
        user: req.session.user,
        role: 'office-head',
        surveyId: surveyId
    });
});

// Handle Survey Submission
router.post('/survey/submit', upload.array('attachments', 5), (req, res) => {
    // In production, save survey responses to database
    console.log('Survey responses:', req.body);
    console.log('Uploaded files:', req.files);
    
    res.redirect('/office-head/survey-confirmation');
});

// Save Survey Draft
router.post('/survey/draft', (req, res) => {
    // In production, save draft to database
    console.log('Draft saved:', req.body);
    res.json({ success: true, message: 'Draft saved successfully' });
});

// Survey Confirmation
router.get('/survey-confirmation', (req, res) => {
    res.render('office-head/survey-confirmation', {
        title: 'Survey Submitted',
        pageTitle: 'Survey Submitted',
        currentPage: 'my-surveys',
        user: req.session.user,
        role: 'office-head'
    });
});

// Submission History
router.get('/submission-history', (req, res) => {
    res.render('office-head/submission-history', {
        title: 'Submission History',
        pageTitle: 'Submission History',
        currentPage: 'submission-history',
        user: req.session.user,
        role: 'office-head'
    });
});

// Announcements
router.get('/announcements', (req, res) => {
    res.render('office-head/announcements', {
        title: 'Announcements',
        pageTitle: 'Announcements',
        currentPage: 'announcements',
        user: req.session.user,
        role: 'office-head'
    });
});

// View survey results (for completed surveys)
router.get('/survey/:id/results', (req, res) => {
    const surveyId = req.params.id;
    res.render('office-head/survey-results', {
        title: 'Survey Results',
        pageTitle: 'Survey Results',
        currentPage: 'my-surveys',
        user: req.session.user,
        role: 'office-head',
        surveyId: surveyId
    });
});

//setting
router.get('/settings', (req, res) => {
    res.render('office-head/settings', {
        title: 'Settings',
        pageTitle: 'Settings',
        currentPage: 'settings',
        user: req.session.user,
        role: 'office-head'
    });
});

//support
router.get('/support', (req, res) => {
    res.render('office-head/support', {
        title: 'Support',
        pageTitle: 'Support',
        currentPage: 'support',
        user: req.session.user,
        role: 'office-head'
    });
});

module.exports = router;