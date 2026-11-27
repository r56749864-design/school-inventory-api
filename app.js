
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');

// Register Models
require('./model/category');

// Routes
const authRoute = require('./route/authRoute');
const itemRoute = require('./route/itemRoute');
const categoryRoute = require('./route/categoryRoute');
const returnRoute = require('./route/returnRoute');
const externalActivityRoute = require('./route/externalActivityRoute');
const activityLogRoute = require('./route/activityLogRoute');
const loanRoute = require('./route/loanRoute');

// Middleware
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);

// Database connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoute);
app.use('/api/items', itemRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/returns', returnRoute);
app.use('/api/external', externalActivityRoute);
app.use('/api/activity-logs', activityLogRoute);
app.use('/api/loans', loanRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
