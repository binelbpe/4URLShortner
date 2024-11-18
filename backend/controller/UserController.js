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

        console.log('Received refresh token:', refreshToken); // Debug log

        const user = await User.findOne({ refreshToken });
        if (!user) {
            console.log('No user found with refresh token'); // Debug log
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            console.log('Refresh token decoded:', decoded); // Debug log

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

            console.log('New tokens generated successfully'); // Debug log

            res.json({ 
                accessToken, 
                refreshToken: newRefreshToken,
                userId: user._id 
            });
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError); // Debug log
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    } catch (error) {
        console.error('Refresh token error:', error); // Debug log
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
