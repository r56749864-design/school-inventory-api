
const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  next();
};

// Create Return
const createReturnValidator = [
  body('loanId')
    .isString()
    .withMessage('Loan ID must be a string')
    .bail()
    .notEmpty()
    .withMessage('Loan ID is required')
    .bail()
    .isMongoId()
    .withMessage('Loan ID must be a valid MongoDB ObjectId'),

  body('condition')
    .optional()
    .isString()
    .withMessage('Return condition must be a string')
    .bail()
    .isIn(['good', 'minor_damage', 'major_damage'])
    .withMessage('Invalid return condition'),

  validate
];

// Verify Return
const verifyReturnValidator = [
  param('id')
    .isMongoId()
    .withMessage('Return ID must be a valid MongoDB ObjectId'),

  body('status')
    .isString()
    .withMessage('Return status must be a string')
    .bail()
    .notEmpty()
    .withMessage('Return status is required')
    .bail()
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),

  validate
];

module.exports = {
  createReturnValidator,
  verifyReturnValidator
};
