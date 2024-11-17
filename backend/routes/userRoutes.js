const { Router } = require('express');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validatemiddleware');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const authController = require('../controller/UserController');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = Router();

// Register Route
router.post('/register', validate(registerValidation), authController.register);

// Login Route
router.post('/login', validate(loginValidation), authController.login);

// Refresh Token Route
router.post('/refresh-token', authController.refreshToken);

// Logout Route
router.post('/logout', authController.logout);

// Verify Route
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -refreshToken');
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Add profile update route
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword, email } = req.body;

    // If updating password
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // If updating email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
