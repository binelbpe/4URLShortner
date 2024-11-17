const shortid = require('shortid');
const Url = require('../models/Url');

// Create short URL
exports.createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;
        const urlCode = shortid.generate();

        const url = new Url({
            originalUrl,
            urlCode,
            owner: req.user.userId,
            date: new Date(),
        });

        await url.save();
        res.json({
            ...url.toJSON(),
            shortUrl: urlCode,
        });
    } catch (error) {
        next(error);
    }
};

// Get all URLs for user
exports.getUserUrls = async (req, res, next) => {
    try {
        const urls = await Url.find({ owner: req.user.userId });
        res.json(urls);
    } catch (error) {
        next(error);
    }
};

// Delete URL
exports.deleteUrl = async (req, res, next) => {
    try {
        const url = await Url.findOne({ _id: req.params.id, owner: req.user.userId });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }

        await url.remove();
        res.json({ message: 'URL deleted' });
    } catch (error) {
        next(error);
    }
};
