const { Router } = require('express');
const validate = require('../middleware/validate.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validations');
const authController = require('../controller/UserController');

const router = Router();

// Register Route
router.post('/register', validate(registerValidation), authController.register);

// Login Route
router.post('/login', validate(loginValidation), authController.login);

// Refresh Token Route
router.post('/refresh-token', authController.refreshToken);

// Logout Route
router.post('/logout', authController.logout);

module.exports = router;
