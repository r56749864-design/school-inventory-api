const jwt = require('jsonwebtoken');
const User = require('../model/user');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError(
      'You are not logged in. Please login first.',
      401
    );
  }

  // Verify JWT Token
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new AppError(
      'The user belonging to this token no longer exists.',
      401
    );
  }

  // Attach user data to request
  req.user = currentUser;

  next();
});

module.exports = protect;
