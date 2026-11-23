
const User = require('../model/user');
const jwt = require('jsonwebtoken');

const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const createActivityLog = require('../service/activityLogService');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  );
};

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({
    name,
    email,
    password
  });

  await createActivityLog({
    userId: user._id,
    activityType: 'REGISTER',
    description: 'User registered successfully'
  });

  const token = generateToken(user);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  await createActivityLog({
    userId: user._id,
    activityType: 'LOGIN',
    description: 'User logged in successfully'
  });

  const token = generateToken(user);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = {
  register,
  login
};
