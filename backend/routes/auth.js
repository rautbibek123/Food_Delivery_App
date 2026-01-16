const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController'); // Import emailController
const auth = require('../middleware/auth');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/send-phone-otp
router.post('/send-phone-otp', authController.sendPhoneOTP);

// POST /api/auth/verify-phone-otp
router.post('/verify-phone-otp', authController.verifyPhoneOTP);

// POST /api/auth/send-email-otp
router.post('/send-email-otp', authController.sendEmailOTP);

// POST /api/auth/verify-email-otp
router.post('/verify-email-otp', authController.verifyEmailOTP);

// GET /api/auth/verify-email/:token - Verify email with token
router.get('/verify-email/:token', emailController.verifyEmailWithToken);

// POST /api/auth/resend-verification
router.post('/resend-verification', authController.resendVerification);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;