const ProductService = require('../services/productService');

describe('ProductService', () => {
  let productService;
  let mockProductRepository;

  beforeEach(() => {
    mockProductRepository = {
      getProductById: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    productService = new ProductService({
      productRepository: mockProductRepository,
    });
  });

  describe('getProductById', () => {
    it('should return a product with discount applied', async () => {
      const productId = '1';
      const mockProduct = {
        id: '1',
        productName: 'Product',
        price: 100,
        discount_type: '1',
      };
      const mockDiscountInfo = {
        id: '1',
        enablement: true,
        discount: 0.1,
      };

      mockProductRepository.getProductById.mockResolvedValue(mockProduct);
      productService.fetchDiscountInfo = jest.fn().mockResolvedValue(mockDiscountInfo);

      const result = await productService.getProductById(productId);

      expect(result.discount).toEqual(mockDiscountInfo.discount);
      expect(result.final_price).toEqual(mockProduct.price * (1 - mockDiscountInfo.discount));
    });

    it('should return a product without discount applied', async () => {
      const productId = '1';
      const mockProduct = {
        id: '1',
        productName: 'Product',
        price: 100,
        discount_type: '1',
      };
      const mockDiscountInfo = {
        id: '1',
        enablement: false,
        discount: 0.1,
      };

      mockProductRepository.getProductById.mockResolvedValue(mockProduct);
      productService.fetchDiscountInfo = jest.fn().mockResolvedValue(mockDiscountInfo);

      const result = await productService.getProductById(productId);

      expect(result.discount).toEqual(0);
      expect(result.final_price).toEqual(mockProduct.price);
    });

    it('should handle error when getProductById throws', async () => {
      mockProductRepository.getProductById.mockRejectedValue(new Error('Database error'));

      await expect(productService.getProductById('1')).rejects.toThrow('Error getting product by ID');
    });
  });

  describe('getAllProducts', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        { id: '1', productName: 'Product 1' },
        { id: '2', productName: 'Product 2' },
      ];

      mockProductRepository.getAll.mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts();

      expect(result).toEqual(mockProducts);
    });

    it('should handle error when getAll throws', async () => {
      mockProductRepository.getAll.mockRejectedValue(new Error('Database error'));

      await expect(productService.getAllProducts()).rejects.toThrow('Error getting products');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        productName: 'New Product',
        productDescription: 'Description of new product',
        status: 'active',
        stock: 10,
        price: 29,
        discount_type: '1',
      };

      const mockCreatedProduct = { ...productData, id: '1' };

      mockProductRepository.create.mockResolvedValue(mockCreatedProduct);

      const createdProduct = await productService.createProduct(productData);

      expect(createdProduct).toEqual(mockCreatedProduct);
    });

    it('should handle error when create throws', async () => {
      const productData = { };

      mockProductRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(productService.createProduct(productData)).rejects.toThrow('Error creating product');
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const productId = '1';
      const updatedData = { productName: 'Updated Product' };
      const mockUpdatedProduct = { ...updatedData, id: productId };

      mockProductRepository.update.mockResolvedValue(mockUpdatedProduct);

      const updatedProduct = await productService.updateProduct(productId, updatedData);

      expect(updatedProduct).toEqual(mockUpdatedProduct);
    });

    it('should handle error when update throws', async () => {
      const productId = '1';
      const updatedData = { /* Mock updated data */ };

      mockProductRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(productService.updateProduct(productId, updatedData)).rejects.toThrow('Error updating product');
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const productId = '1';

      mockProductRepository.delete.mockResolvedValue();

      const result = await productService.deleteProduct(productId);

      expect(result).toBeUndefined();
    });

    it('should handle error when delete throws', async () => {
      const productId = '1';

      mockProductRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(productService.deleteProduct(productId)).rejects.toThrow('Error deleting product');
    });
  });

  // Test other methods (getAllProducts, createProduct, updateProduct, deleteProduct) similarly...
});
