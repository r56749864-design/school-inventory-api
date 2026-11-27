
const swaggerJsdoc = require('swagger-jsdoc');

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Inventory API',
      version: '1.0.0',
      description: 'API documentation for School Inventory Management System'
    },
    servers: [
      {
        url: isProduction
          ? 'https://school-inventory-api.vercel.app'
          : 'http://localhost:5000',
        description: isProduction
          ? 'Production server'
          : 'Local development server'
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User registration and login' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Items', description: 'Item management' },
      { name: 'Loans', description: 'Loan management' },
      { name: 'Returns', description: 'Return management' },
      { name: 'Activity Logs', description: 'Activity log management' },
      { name: 'External Activity', description: 'External activity callback' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./route/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
