const { check, validationResult } = require('express-validator');

const contactInfoValidationRules = [
  check('location')
    .isString()
    .withMessage('Location must be a string.')
    .notEmpty()
    .withMessage('Location is required.')
    .isLength({ max: 255 })
    .withMessage('Location must be less than 255 characters.'),

  check('telephone')
    .isString()
    .withMessage('Telephone must be a string.'),

  check('mobile')
    .isString()
    .withMessage('Mobile must be a string.'),

  check('email')
    .isEmail()
    .withMessage('Email must be a valid email address.')
];

const contactInfoValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the errors if there are any validation issues
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { contactInfoValidationRules, contactInfoValidate };
