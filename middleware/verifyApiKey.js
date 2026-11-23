
const AppError = require('../util/appError');

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.EXTERNAL_API_KEY;

  if (!expectedApiKey) {
    console.error('EXTERNAL_API_KEY is not configured in .env');
    return next(
      new AppError('External API Key is not configured', 500)
    );
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return next(
      new AppError('Invalid or missing API Key', 401)
    );
  }

  next();
};

module.exports = verifyApiKey;
