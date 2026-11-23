
const { body, validationResult } = require('express-validator');

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

const createExternalActivityValidator = [
  body('activityType')
    .trim()
    .notEmpty()
    .withMessage('Activity type is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('userId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('User ID must be a valid MongoDB ObjectId'),

  validate
];

module.exports = {
  createExternalActivityValidator
};
