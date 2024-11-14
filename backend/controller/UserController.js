const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
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
            config.get('jwtSecret'),
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            config.get('refreshSecret'),
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

        const decoded = jwt.verify(refreshToken, config.get('refreshSecret'));

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            config.get('jwtSecret'),
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId },
            config.get('refreshSecret'),
            { expiresIn: '7d' }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken, refreshToken: newRefreshToken });
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
