
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

// Create Category
const createCategoryValidator = [
  body('name')
    .isString()
    .withMessage('Category name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Category name is required'),

  body('description')
    .optional()
    .custom((value) => typeof value === 'string')
    .withMessage('Description must be a string'),

  validate
];

// Update Category
const updateCategoryValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Category name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty'),

  body('description')
    .optional()
    .custom((value) => typeof value === 'string')
    .withMessage('Description must be a string'),

  validate
];

// Validate Category ID
const categoryIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Category ID must be a valid MongoDB ObjectId'),

  validate
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator
};
