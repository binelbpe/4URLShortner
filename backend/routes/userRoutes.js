const { Router } = require('express');
const validate = require('../middleware/validatemiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const authController = require('../controller/UserController');
const auth = require('../middleware/authMiddleware');
const refreshTokenMiddleware = require('../middleware/refreshTokenMiddleware');

const router = Router();

// Auth Routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken);
router.post('/logout', authController.logout);

// Profile Routes
router.get('/profile/get', auth, authController.getProfile);
router.put('/profile/update', auth, authController.updateProfile);

module.exports = router;
