
const Return = require('../model/return');
const Loan = require('../model/loan');
const Item = require('../model/item');

const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

// User mengajukan pengembalian
const createReturn = catchAsync(async (req, res, next) => {
  const { loanId, condition } = req.body;

  const loan = await Loan.findOne({
    _id: loanId,
    user: req.user._id,
    archived: false
  });

  if (!loan) {
    throw new AppError('Loan not found', 404);
  }

  if (loan.status !== 'borrowed') {
    throw new AppError(
      'Only borrowed loans can be returned',
      400
    );
  }

  const existingReturn = await Return.findOne({
    loan: loanId,
    status: 'pending',
    archived: false
  });

  if (existingReturn) {
    throw new AppError(
      'Return request is already pending',
      409
    );
  }

  const returnRequest = await Return.create({
    loan: loanId,
    condition,
    status: 'pending',
    created_by: String(req.user._id),
    updated_by: String(req.user._id)
  });

  res.status(201).json({
    success: true,
    message: 'Return request submitted successfully',
    data: {
      return: returnRequest
    }
  });
});

// User melihat riwayat pengembalian miliknya
const getMyReturns = catchAsync(async (req, res, next) => {
  const loans = await Loan.find({
    user: req.user._id
  }).select('_id');

  const loanIds = loans.map((loan) => loan._id);

  const returns = await Return.find({
    loan: { $in: loanIds },
    archived: false
  })
    .populate({
      path: 'loan',
      select: 'itemSnapshot quantity status dueDate'
    })
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    results: returns.length,
    data: {
      returns
    }
  });
});

// Admin melihat seluruh riwayat pengembalian
const getAllReturns = catchAsync(async (req, res, next) => {
  const returns = await Return.find({
    archived: false
  })
    .populate({
      path: 'loan',
      select: 'user itemSnapshot quantity status dueDate'
    })
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    results: returns.length,
    data: {
      returns
    }
  });
});

// Admin memverifikasi pengembalian
const verifyReturn = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    throw new AppError(
      'Status must be approved or rejected',
      400
    );
  }

  const returnRequest = await Return.findOne({
    _id: req.params.id,
    status: 'pending',
    archived: false
  });

  if (!returnRequest) {
    throw new AppError(
      'Pending return request not found',
      404
    );
  }

  const loan = await Loan.findById(returnRequest.loan);

  if (!loan || loan.status !== 'borrowed') {
    throw new AppError(
      'Loan is not in borrowed status',
      400
    );
  }

  if (status === 'rejected') {
    returnRequest.status = 'rejected';
    returnRequest.updated_by = String(req.user._id);
    returnRequest.updated_at = Date.now();

    await returnRequest.save();

    return res.status(200).json({
      success: true,
      message: 'Return request rejected'
    });
  }

  const session = await Loan.startSession();

  try {
    await session.withTransaction(async () => {
      const updatedReturn = await Return.findOneAndUpdate(
        {
          _id: returnRequest._id,
          status: 'pending'
        },
        {
          status: 'approved',
          updated_by: String(req.user._id),
          updated_at: Date.now()
        },
        {
          new: true,
          session
        }
      );

      if (!updatedReturn) {
        throw new AppError(
          'Return request has already been processed',
          409
        );
      }

      const updatedLoan = await Loan.findOneAndUpdate(
        {
          _id: loan._id,
          status: 'borrowed'
        },
        {
          status: 'returned',
          updated_by: String(req.user._id),
          updated_at: Date.now()
        },
        {
          new: true,
          session
        }
      );

      if (!updatedLoan) {
        throw new AppError(
          'Loan has already been processed',
          409
        );
      }

      const updatedItem = await Item.findByIdAndUpdate(
        loan.item,
        {
          $inc: {
            stock: loan.quantity
          },
          updated_by: String(req.user._id),
          updated_at: Date.now()
        },
        {
          new: true,
          session
        }
      );

      if (!updatedItem) {
        throw new AppError('Item not found', 404);
      }
    });

    res.status(200).json({
      success: true,
      message: 'Return approved and stock restored successfully'
    });
  } finally {
    await session.endSession();
  }
});

module.exports = {
  createReturn,
  getMyReturns,
  getAllReturns,
  verifyReturn
};
