const { Router } = require('express');
const urlController = require('../controller/urlCodeController');

const router = Router();

// Redirect URL route
router.get('/:code', urlController.redirectUrl);

module.exports = router;
