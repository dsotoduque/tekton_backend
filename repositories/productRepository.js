const Datastore = require('nedb');

class ProductRepository {
  constructor() {
    this.db = new Datastore();
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes in milliseconds
    this.initializeCache();
    this.consecutiveId = 0;
  }

  initializeCache() {
    // Initialize the cache with default values
    this.cache.set(1, 'active');
    this.cache.set(0, 'inactive');
  }

  async getProductById(productId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: productId }, async (err, product) => {
        if (err) {
          reject(err);
        } else {
          if (product) {
            product.status = await this.getCachedStatus(product.status, true);
          }
          resolve(product);
        }
      });
    });
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, async (err, products) => {
        if (err) {
          reject(err);
        } else {
          const translatedProducts = await Promise.all(products.map(async product => ({
            ...product,
            status: await this.getCachedStatus(product.status, true)
          })));
          resolve(translatedProducts);
        }
      });
    });
  }

  async create(productData) {
    const { status, ...rest } = productData;
    const translatedStatus = await this.getCachedStatus(status);
    const insertedProduct = { ...rest, status: translatedStatus };

    return new Promise((resolve, reject) => {
      this.db.insert(insertedProduct, (err, newProduct) => {
        if (err) {
          reject(err);
        } else {
          resolve(newProduct);
        }
      });
    });
  }

  async update(productId, updatedData) {
    const { status, ...rest } = updatedData;
    const translatedStatus = await this.getCachedStatus(status);
    const updatedProduct = { ...rest, status: translatedStatus };

    return new Promise((resolve, reject) => {
      this.db.update({ _id: productId }, updatedProduct, {}, (err, numUpdated) => {
        if (err) {
          reject(err);
        } else {
          resolve(numUpdated);
        }
      });
    });
  }

  async delete(productId) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: productId }, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  async getCachedStatus(status, returnStatus = false) {
    if (this.cache.has(status)) {
      return this.cache.get(status);
    }

    // Search cache by value (status name)
    const cachedValue = Array.from(this.cache.entries()).find(entry => entry[1] === status);
    console.log(cachedValue);
    if (cachedValue) {
      return returnStatus?cachedValue[1]: cachedValue[0];
    }

    // Simulate async translation logic
    const translatedStatus = await new Promise(resolve => {
      setTimeout(() => {
        const translatedValue = this.cache.get(status);
        resolve(translatedValue);
      }, 100);
    });

    return translatedStatus;
  }
}

module.exports = ProductRepository;
