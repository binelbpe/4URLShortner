const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Controller
exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

// Login Controller
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken, userId: user.id });
    } catch (error) {
        next(error);
    }
};

// Refresh Token Controller
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token not provided' });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

            const accessToken = jwt.sign(
                { userId: decoded.userId },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const newRefreshToken = jwt.sign(
                { userId: decoded.userId },
                process.env.REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            user.refreshToken = newRefreshToken;
            await user.save();

            res.json({ 
                accessToken, 
                refreshToken: newRefreshToken,
                userId: user._id 
            });
        } catch (jwtError) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    } catch (error) {
        next(error);
    }
};

// Logout Controller
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// Profile Methods
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            email: user.email,
            isAuthenticated: true
        });
    } catch (error) {
        next(error);
    }
};
//update profile
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { currentPassword, newPassword, email } = req.body;
  
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = await bcrypt.hash(newPassword, 12);
        }

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
        next(error);
    }
};

// Verify user (for auth check)
exports.verifyUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};
