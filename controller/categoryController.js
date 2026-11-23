const Category = require('../model/category');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

// Get All Categories (Admin Only)
const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    archived: false
  });

  res.status(200).json({
    success: true,
    results: categories.length,
    data: {
      categories
    }
  });
});

// Get Single Category (Admin Only)
const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    archived: false
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      category
    }
  });
});

// Create Category (Admin Only)
const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create({
    ...req.body,
    created_by: req.user._id,
    updated_by: req.user._id
  });

  res.status(201).json({
    success: true,
    data: {
      category
    }
  });
});

// Update Category (Admin Only)
const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      archived: false
    },
    {
      ...req.body,
      updated_by: req.user._id,
      updated_at: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      category
    }
  });
});

// Delete Category (Admin Only)
const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      archived: false
    },
    {
      archived: true,
      updated_by: req.user._id,
      updated_at: Date.now()
    },
    {
      new: true
    }
  );

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Category archived successfully'
  });
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
