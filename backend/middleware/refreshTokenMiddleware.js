const jwt = require('jsonwebtoken');
const User = require('../models/User');

const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token not provided' });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const user = await User.findOne({ _id: decoded.userId, refreshToken });

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};

module.exports = refreshTokenMiddleware; 