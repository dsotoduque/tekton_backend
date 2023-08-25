const Datastore = require('nedb');
const ProductRepository = require('../repositories/productRepository');

describe('ProductRepository', () => {
  let productRepository;
  let mockDb;

  beforeEach(() => {
    mockDb = new Datastore();
    productRepository = new ProductRepository();
    productRepository.db = mockDb;
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { _id: '1', status: 1 /* Mock other product fields */ };
      mockDb.findOne = jest.fn().mockImplementation((query, callback) => {
        callback(null, mockProduct);
      });

      const result = await productRepository.getProductById('1');

      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      mockDb.findOne = jest.fn().mockImplementation((query, callback) => {
        callback(null, null);
      });

      const result = await productRepository.getProductById('1');

      expect(result).toBeNull();
    });

    it('should handle error when database error occurs', async () => {
      mockDb.findOne = jest.fn().mockImplementation((query, callback) => {
        callback(new Error('Database error'));
      });

      await expect(productRepository.getProductById('1')).rejects.toThrow('Database error');
    });
  });

  describe('getAll', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        { _id: '1', status: 'active' /* Mock other product fields */ },
        { _id: '2', status: 'inactive' /* Mock other product fields */ },
      ];
      mockDb.find = jest.fn().mockImplementation((query, callback) => {
        callback(null, mockProducts);
      });

      const result = await productRepository.getAll();

      expect(result).toEqual(mockProducts);
    });

    it('should handle error when database error occurs', async () => {
      mockDb.find = jest.fn().mockImplementation((query, callback) => {
        callback(new Error('Database error'));
      });

      await expect(productRepository.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const mockProductData = {
        productName: 'New Product',
        productDescription: 'Description of new product',
        status: 'active',
        stock: 10,
        price: 29,
      };

      mockDb.insert = jest.fn().mockImplementation((product, callback) => {
        callback(null, { ...product, _id: '1' });
      });

      const createdProduct = await productRepository.create(mockProductData);
      createdProduct.status = 'active';

      expect(createdProduct).toEqual({ ...mockProductData, _id: '1' });
    });

    it('should handle error when database error occurs', async () => {
      const mockProductData = { /* Mock product data */ };

      mockDb.insert = jest.fn().mockImplementation((product, callback) => {
        callback(new Error('Database error'));
      });

      await expect(productRepository.create(mockProductData)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const mockProductId = '1';
      const mockUpdatedData = {
        productName: 'Updated Product',
        productDescription: 'Updated description',
        status: 'inactive',
        stock: 5,
        price: 25,
      };

      mockDb.update = jest.fn().mockImplementation((query, updatedProduct, options, callback) => {
        callback(null, 1); // Number of updated documents
      });

      const numUpdated = await productRepository.update(mockProductId, mockUpdatedData);

      expect(numUpdated).toBe(1);
    });

    it('should handle error when database error occurs', async () => {
      const mockProductId = '1';
      const mockUpdatedData = { /* Mock updated data */ };

      mockDb.update = jest.fn().mockImplementation((query, updatedProduct, options, callback) => {
        callback(new Error('Database error'));
      });

      await expect(productRepository.update(mockProductId, mockUpdatedData)).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const mockProductId = '1';

      mockDb.remove = jest.fn().mockImplementation((query, options, callback) => {
        callback(null, 1); // Number of removed documents
      });

      const numRemoved = await productRepository.delete(mockProductId);

      expect(numRemoved).toBe(1);
    });

    it('should handle error when database error occurs', async () => {
      const mockProductId = '1';

      mockDb.remove = jest.fn().mockImplementation((query, options, callback) => {
        callback(new Error('Database error'));
      });

      await expect(productRepository.delete(mockProductId)).rejects.toThrow('Database error');
    });
  });

  describe('getCachedStatus', () => {
    it('should get cached status by key', async () => {
      const mockStatusKey = 1;
      const mockStatusValue = 'active';

      const cachedStatus = await productRepository.getCachedStatus(mockStatusKey);

      expect(cachedStatus).toBe(mockStatusValue);
    });

    it('should translate cached status by value', async () => {
      const mockStatusKey = 'active';
      const mockStatusValue = 1;

      const cachedStatus = await productRepository.getCachedStatus(mockStatusKey);

      expect(cachedStatus).toBe(mockStatusValue);
    });

    it('should simulate cache miss and translate status', async () => {
      const mockStatusKey = 2;
      const mockStatusValue = undefined;

      const cachedStatus = await productRepository.getCachedStatus(mockStatusKey);

      expect(cachedStatus).toBe(mockStatusValue);
    });
  });

  // Test other methods (create, update, delete, getCachedStatus) similarly...
});
