const Url = require('../models/Url');

exports.redirectUrl = async (req, res, next) => {
    try {
        const { code } = req.params;
        const url = await Url.findOne({ urlCode: code });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
     
        url.clicks += 1;
        await url.save();
        
        return res.redirect(url.originalUrl);
    } catch (error) {
        next(error);
    }
};
