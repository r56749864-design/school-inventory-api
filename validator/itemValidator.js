
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

const createItemValidator = [
  body('name')
    .isString()
    .withMessage('Item name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Item name is required'),

  body('description')
    .optional()
    .custom((value) => typeof value === 'string')
    .withMessage('Description must be a string'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('condition')
    .optional()
    .isIn(['good', 'minor_damage', 'major_damage'])
    .withMessage('Invalid item condition'),

  body('imageUrl')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('Image URL must be valid'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .bail()
    .isMongoId()
    .withMessage('Category ID must be a valid MongoDB ObjectId'),

  validate
];

const updateItemValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Item name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Item name cannot be empty'),

  body('description')
    .optional()
    .custom((value) => typeof value === 'string')
    .withMessage('Description must be a string'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('condition')
    .optional()
    .isIn(['good', 'minor_damage', 'major_damage'])
    .withMessage('Invalid item condition'),

  body('imageUrl')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('Image URL must be valid'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Category ID must be a valid MongoDB ObjectId'),

  validate
];

const itemIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Item ID must be a valid MongoDB ObjectId'),

  validate
];

module.exports = {
  createItemValidator,
  updateItemValidator,
  itemIdValidator
};
