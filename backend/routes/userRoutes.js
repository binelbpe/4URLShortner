const { Router } = require('express');
const validate = require('../middleware/validatemiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const authController = require('../controller/UserController');
const auth = require('../middleware/authMiddleware');

const router = Router();

// Auth Routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Profile/Verification Route
router.get('/profile', auth, authController.getProfile);

module.exports = router;
