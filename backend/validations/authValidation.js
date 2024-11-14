const { check } = require('express-validator');

const registerValidation = [
    check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(value => {
            if (!value.includes('@')) {
                throw new Error('Email must contain @ symbol');
            }
            return true;
        }),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/)
        .withMessage('Password must contain at least one letter')
];

const loginValidation = [
    check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please enter a valid email'),
    check('password')
        .exists()
        .withMessage('Password is required')
];

module.exports = {
    registerValidation,
    loginValidation
}; 