const { check } = require('express-validator');

const createUrlValidation = [
    check('originalUrl')
        .trim()
        .notEmpty()
        .withMessage('URL is required')
        .isURL({
            protocols: ['http', 'https'],
            require_protocol: true
        })
        .withMessage('Please enter a valid URL with http or https protocol')
        .custom(value => {
            try {
                new URL(value);
                return true;
            } catch (err) {
                throw new Error('Invalid URL format');
            }
        })
];

module.exports = {
    createUrlValidation
}; 