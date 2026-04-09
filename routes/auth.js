const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/authController');
const { ensureGuest } = require('../Middleware/auth');

router.get('/login', ensureGuest, AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

module.exports = router;