const express = require('express');
const { validationResult, body, param } = require('express-validator');

class ProductController {
  constructor({ productService }) {
    this.productService = productService;
    this.router = express.Router();
    /**
     * @swagger
     * tags:
     *   name: Products
     *   description: API endpoints for managing products
     */

    /**
     * @swagger
     * /products:
     *   post:
     *     summary: Create a new product
     *     tags: [Products]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               productName:
     *                 type: string
     *               productDescription:
     *                 type: string
     *               status:
     *                 type: string
     *               stock:
     *                 type: integer
     *               price:
     *                 type: number
     *               discount_type:
     *                 type: string
     *     responses:
     *       201:
     *         description: Successful response with the created product
     *       400:
     *         description: Invalid input data
     *       500:
     *         description: An error occurred while creating the product
     */

    this.router.post(
      '/',
      [
        body('productName').notEmpty().withMessage('Product name is required'),
        body('productDescription').notEmpty().withMessage('Product description is required'),
        body('status').isIn(['active', 'inactive']).withMessage('Invalid status'),
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('price').isInt({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('discount_type').isIn(['1', '2', '3']).withMessage('Discount type must be valid value'),
      ],
      this.createProduct.bind(this)
    );

    /**
     * @swagger
     * /products:
     *   get:
     *     summary: Get all products
     *     tags: [Products]
     *     responses:
     *       200:
     *         description: Successful response with a list of products
     *       500:
     *         description: An error occurred while getting products
     */
    this.router.get('/', this.getAllProducts.bind(this));

    /**
     * @swagger
     * /products/{id}:
     *   get:
     *     summary: Get a product by ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the product to retrieve
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successful response with the product details
     *       404:
     *         description: Product not found
     *       500:
     *         description: An error occurred while getting the product
     */
    this.router.get('/:id', [param('id').isAlphanumeric()], this.getProductById.bind(this));

    /**
     * @swagger
     * /products/{id}:
     *   put:
     *     summary: Update a product by ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the product to update
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               productName:
     *                 type: string
     *               productDescription:
     *                 type: string
     *               status:
     *                 type: string
     *               stock:
     *                 type: integer
     *               price:
     *                 type: number
     *               discount_type:
     *                 type: string
     *     responses:
     *       200:
     *         description: Successful response with the updated product
     *       400:
     *         description: Invalid input data
     *       500:
     *         description: An error occurred while updating the product
     */
    this.router.put(
      '/:id',
      [
        param('id').isAlphanumeric(),
        body('productName').notEmpty().withMessage('Product name is required'),
        body('productDescription').notEmpty().withMessage('Product description is required'),
        body('status').isIn(['active', 'inactive']).withMessage('Invalid status'),
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
        body('discount_type').isIn(['1', '2', '3']).withMessage('Discount type must be valid value'),
      ],
      this.updateProduct.bind(this)
    );
    
    /**
     * @swagger
     * /products/{id}:
     *   delete:
     *     summary: Delete a product by ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the product to delete
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Successful response with no content
     *       500:
     *         description: An error occurred while deleting the product
     */
    this.router.delete('/:id', [param('id').isAlphanumeric()], this.deleteProduct.bind(this));
  }

  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productData = req.body;
      const createdProduct = await this.productService.createProduct(productData);
      console.log(createdProduct);
      return res.status(201).json(createdProduct);
    } catch (error) {
      console.info('Error creating product:', error);
      return res.status(500).json({ error: 'An error occurred while creating the product.' });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productService.getAllProducts();
      console.log(products);
      return res.status(200).json(products);
    } catch (error) {
      console.info('Error getting products:', error);
      return res.status(500).json({ error: 'An error occurred while getting products.' });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await this.productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.info('Error getting product by ID:', error);
      return res.status(500).json({ error: 'An error occurred while getting the product.' });
    }
  }

  async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productId = req.params.id;
      const productData = req.body;
      const updatedProduct = await this.productService.updateProduct(productId, productData);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.info('Error updating product:', error);
      return res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      await this.productService.deleteProduct(productId);
      return res.status(204).send();
    } catch (error) {
      console.info('Error deleting product:', error);
      return res.status(500).json({ error: 'An error occurred while deleting the product.' });
    }
  }

  async healthCheck(req, res) {
    try {
      // Realiza una comprobación simple para determinar si el servicio está en funcionamiento
      // Puedes personalizar esta lógica según tus necesidades
      const status = 'OK';
      return res.status(200).json({ status });
    } catch (error) {
      console.error('Error en el health check:', error);
      return res.status(500).json({ error: 'Error en el health check' });
    }
  }


}

module.exports = ProductController;