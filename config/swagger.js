
const swaggerJsdoc = require('swagger-jsdoc');

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
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
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
