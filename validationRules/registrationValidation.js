const { body, validationResult } = require('express-validator');

// Validation rules
const registrationValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),

  body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),

  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('confirm_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  body('role').notEmpty().withMessage('Role must required'),
];

// Middleware to handle validation errors
const validateRegisterUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registrationValidationRules,
  validateRegisterUser,
};
