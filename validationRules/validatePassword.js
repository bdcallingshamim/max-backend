const { body, validationResult } = require('express-validator');

// Validation rules
const passwordValidationRules = [
  body('newPassword')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Middleware to handle validation errors
const validatePassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  passwordValidationRules,
  validatePassword,
};
