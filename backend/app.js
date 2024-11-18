require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const urlRoutes = require('./routes/urlRoutes');
const urlCodeRoutes = require('./routes/urlCodeRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', userRoutes);
app.use('/url', urlRoutes);
app.use('/', urlCodeRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
