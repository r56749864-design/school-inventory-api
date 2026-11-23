
const Item = require('../model/item');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const createActivityLog = require('../service/activityLogService');

// Get All Items (Public) - Pagination, Filters, Sorting & Search
const getAllItems = catchAsync(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const filter = {
    archived: false
  };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.condition) {
    filter.condition = req.query.condition;
  }

  if (req.query.search) {
    filter.name = {
      $regex: req.query.search,
      $options: 'i'
    };
  }

  const sortBy = req.query.sortBy || 'created_at';
  const order = req.query.order === 'asc' ? 1 : -1;

  const allowedSortFields = [
    'name',
    'stock',
    'condition',
    'created_at',
    'updated_at'
  ];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'created_at';

  const totalItems = await Item.countDocuments(filter);

  const items = await Item.find(filter)
    .populate('category', 'name')
    .sort({ [sortField]: order })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    results: items.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      limit
    },
    sorting: {
      sortBy: sortField,
      order: order === 1 ? 'asc' : 'desc'
    },
    search: req.query.search || '',
    data: {
      items
    }
  });
});

// Get Single Item (Public)
const getItem = catchAsync(async (req, res, next) => {
  const item = await Item.findOne({
    _id: req.params.id,
    archived: false
  }).populate('category', 'name');

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      item
    }
  });
});

// Create Item (Admin Only)
const createItem = catchAsync(async (req, res, next) => {
  const item = await Item.create({
    ...req.body,
    created_by: req.user._id,
    updated_by: req.user._id
  });

  await createActivityLog({
    userId: req.user._id,
    activityType: 'CREATE_ITEM',
    description: `Admin created item: ${item.name}`
  });

  res.status(201).json({
    success: true,
    data: {
      item
    }
  });
});

// Update Item (Admin Only)
const updateItem = catchAsync(async (req, res, next) => {
  const item = await Item.findOneAndUpdate(
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

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  await createActivityLog({
    userId: req.user._id,
    activityType: 'UPDATE_ITEM',
    description: `Admin updated item: ${item.name}`
  });

  res.status(200).json({
    success: true,
    data: {
      item
    }
  });
});

// Delete Item (Admin Only)
const deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findOneAndUpdate(
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

  if (!item) {
    throw new AppError('Item not found', 404);
  }

  await createActivityLog({
    userId: req.user._id,
    activityType: 'DELETE_ITEM',
    description: `Admin archived item: ${item.name}`
  });

  res.status(200).json({
    success: true,
    message: 'Item archived successfully'
  });
});

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
};
