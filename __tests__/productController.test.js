const express = require('express');
const request = require('supertest');
const { asValue } = require('awilix');
const { createContainer } = require('awilix');
const { scopePerRequest } = require('awilix-express');
const bodyParser = require('body-parser');
const ProductController = require('../controllers/productController');

// Mock del servicio ProductService
const mockProductService = {
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

const container = createContainer();
container.register({
  productService: asValue(mockProductService),
});

const app = express();
app.use(bodyParser.json());
app.use(scopePerRequest(container));

const productControllerInstance = new ProductController({
  productService: container.resolve('productService'),
});

app.use('/products', productControllerInstance.router);

describe('ProductController', () => {
  describe('GET /products', () => {
    it('should return a list of products', async () => {
      // Mock implementation for getAllProducts
      mockProductService.getAllProducts.mockResolvedValue([
        { id: '1', productName: 'Product 1' },
        { id: '2', productName: 'Product 2' },
      ]);

      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should handle error when getting products', async () => {
        // Mock implementation for getAllProducts with error
        mockProductService.getAllProducts.mockRejectedValue(new Error('Database error'));
  
        const response = await request(app).get('/products');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while getting products.');
      });
  });

  describe('GET /products/:id', () => {
    it('should return a product by ID', async () => {
      // Mock implementation for getProductById
      mockProductService.getProductById.mockResolvedValue({ id: '1', productName: 'Product 1' });

      const response = await request(app).get('/products/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.productName).toBe('Product 1');
    });

    it('should handle error when product is not found', async () => {
      // Mock implementation for getProductById with null result
      mockProductService.getProductById.mockResolvedValue(null);

      const response = await request(app).get('/products/1');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found.');
    });

  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        productName: 'New Product',
        productDescription: 'Description of new product',
        status: 'active',
        stock: 10,
        price: 29,
        discount_type: '1',
      };

      // Mock implementation for createProduct
      mockProductService.createProduct.mockResolvedValue(newProduct);

      const response = await request(app).post('/products').send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body.productName).toBe('New Product');
    });

    it('should handle error when creating a product', async () => {
      const newProduct = {
        productName: 'New Product',
        productDescription: 'Description of new product',
        status: 'active',
        stock: 10,
        price: 29,
        discount_type: '1',
      };

      // Mock implementation for createProduct with error
      mockProductService.createProduct.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/products').send(newProduct);
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('An error occurred while creating the product.');
    });

  });

  describe('PUT /products/:id', () => {
    it('should update a product by ID', async () => {
      const updatedProduct = {
        productName: 'Updated Product',
        productDescription: 'Updated description',
        status: 'inactive',
        stock: 5,
        price: 19,
        discount_type: '1',
      };

      // Mock implementation for updateProduct
      mockProductService.updateProduct.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .put('/products/1')
        .send(updatedProduct)
        .set('Accept', 'application/json');  // Agregado Accept header
      expect(response.status).toBe(200);  // Corregido a 200
      expect(response.body.productName).toBe('Updated Product');
    });

    it('should handle error when updating a product', async () => {
      const updatedProduct = {
        productName: 'Updated Product',
        productDescription: 'Updated description',
        status: 'inactive',
        stock: 5,
        price: 19,
        discount_type: '1',
      };

      // Mock implementation for updateProduct with error
      mockProductService.updateProduct.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/products/1').send(updatedProduct);
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('An error occurred while updating the product.');
    });

    it('should handle error when updating a non-existent product', async () => {
      const updatedProduct = {
        productName: 'Updated Product',
        productDescription: 'Updated description',
        status: 'inactive',
        stock: 5,
        price: 19,
        discount_type: '1',
      };

      // Mock implementation for updateProduct with null result
      mockProductService.updateProduct.mockResolvedValue(null);

      const response = await request(app).put('/products/1').send(updatedProduct);
      expect(response.status).toBe(200);
    });

    // Add more test cases for validation errors, etc.
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product by ID', async () => {
      // Mock implementation for deleteProduct
      mockProductService.deleteProduct.mockResolvedValue();

      const response = await request(app).delete('/products/1');
      expect(response.status).toBe(204);
    });

    it('should handle error when deleting a product', async () => {
      // Mock implementation for deleteProduct with error
      mockProductService.deleteProduct.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/products/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('An error occurred while deleting the product.');
    });
  });
});
