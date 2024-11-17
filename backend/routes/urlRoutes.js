const { Router } = require('express');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validatemiddleware');
const { createUrlValidation } = require('../validations/urlValidation');
const urlController = require('../controller/UrlController');

const router = Router();

// Create short URL
router.post('/shorten', auth, validate(createUrlValidation), urlController.createShortUrl);

// Get all URLs for user
router.get('/', auth, urlController.getUserUrls);

// Delete URL
router.delete('/:id', auth, urlController.deleteUrl);

module.exports = router;
