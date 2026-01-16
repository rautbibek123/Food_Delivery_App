const emailController = require('../controllers/emailController');

describe('Email Controller', () => {
    test('should have all expected exports', () => {
        expect(emailController.sendVerificationEmail).toBeDefined();
        expect(emailController.sendPasswordResetEmail).toBeDefined();
        expect(emailController.sendWelcomeEmail).toBeDefined();
        expect(emailController.sendPasswordResetConfirmation).toBeDefined();
        expect(emailController.sendEmailOTP).toBeDefined();
        expect(emailController.verifyEmailWithToken).toBeDefined();
    });
});
