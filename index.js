const express = require('express');
const { asClass, asValue, createContainer } = require('awilix');
const { scopePerRequest } = require('awilix-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
const Logger = require('./logs/logger')

const container = createContainer();
container.register({
  productService: asClass(require('./services/productService')).scoped(),
  productRepository: asClass(require('./repositories/productRepository')).scoped(),
  axiosInstance: asValue(require('axios')),
});

app.use(scopePerRequest(container));
app.use(Logger.logResponseTime);
app.use(bodyParser.json());

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product API',
      version: '1.0.0',
      description: 'API documentation for product management',
    },
  },
  apis: ['./controllers/productController.js'], // Path to your controller
};

// Initialize Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const ProductController = require('./controllers/productController');

const productController = new ProductController({
  productService: container.resolve('productService'),
});

app.use('/products', productController.router);
app.get('/health', productController.healthCheck);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});