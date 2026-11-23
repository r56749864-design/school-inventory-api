
const mongoose = require('mongoose');
const Loan = require('../model/loan');
const Item = require('../model/item');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

const createLoan = catchAsync(async (req, res, next) => {
  const { item, quantity, dueDate } = req.body;

  const requestedQuantity = Number(quantity);

  if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
    return next(new AppError('Quantity must be a positive integer', 400));
  }

  const selectedItem = await Item.findOne({
    _id: item,
    archived: false
  }).populate('category', 'name');

  if (!selectedItem) {
    return next(new AppError('Item not found', 404));
  }

  if (selectedItem.stock < requestedQuantity) {
    return next(new AppError('Insufficient item stock', 400));
  }

  const loan = await Loan.create({
    user: req.user._id,
    item: selectedItem._id,
    itemSnapshot: {
      name: selectedItem.name,
      category: selectedItem.category.name
    },
    quantity: requestedQuantity,
    dueDate,
    status: 'pending',
    created_by: req.user._id.toString(),
    updated_by: req.user._id.toString()
  });

  res.status(201).json({
    success: true,
    message: 'Loan request submitted successfully',
    data: { loan }
  });
});

const verifyLoan = catchAsync(async (req, res, next) => {
  const { action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return next(new AppError('Action must be approve or reject', 400));
  }

  const session = await mongoose.startSession();
  let verifiedLoan;

  try {
    await session.withTransaction(async () => {
      const loan = await Loan.findById(req.params.id).session(session);

      if (!loan || loan.archived) {
        throw new AppError('Loan not found', 404);
      }

      if (loan.status !== 'pending') {
        throw new AppError('Loan is not pending verification', 400);
      }

      if (action === 'approve') {
        const updatedItem = await Item.findOneAndUpdate(
          {
            _id: loan.item,
            archived: false,
            stock: { $gte: loan.quantity }
          },
          {
            $inc: { stock: -loan.quantity },
            $set: { updated_by: req.user._id.toString() }
          },
          { new: true, session }
        );

        if (!updatedItem) {
          throw new AppError(
            'Insufficient item stock for loan approval',
            400
          );
        }

        loan.status = 'borrowed';
      } else {
        loan.status = 'rejected';
      }

      loan.updated_by = req.user._id.toString();
      await loan.save({ session });

      verifiedLoan = loan;
    });

    res.status(200).json({
      success: true,
      message: action === 'approve'
        ? 'Loan approved successfully'
        : 'Loan rejected successfully',
      data: { loan: verifiedLoan }
    });
  } finally {
    await session.endSession();
  }
});

// User: melihat riwayat peminjaman sendiri
const getMyLoans = catchAsync(async (req, res) => {
  const loans = await Loan.find({
    user: req.user._id,
    archived: false
  }).sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    results: loans.length,
    data: { loans }
  });
});

// Admin: melihat seluruh data peminjaman
const getAllLoans = catchAsync(async (req, res) => {
  const loans = await Loan.find({
    archived: false
  })
    .populate('user', 'name email')
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    results: loans.length,
    data: { loans }
  });
});

module.exports = {
  createLoan,
  verifyLoan,
  getMyLoans,
  getAllLoans
};
