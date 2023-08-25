const axios = require('axios');

class ProductService {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  async getProductById(productId) {
    try {
      const product = await this.productRepository.getProductById(productId);

      if (!product) {
        return null;
      }

      const discountInfo = await this.fetchDiscountInfo(product.discount_type);
      if (discountInfo.enablement) {
        const discountedPrice = product.price * (1 - discountInfo.discount);
        product.discount = discountInfo.discount;
        product.final_price = discountedPrice;
      } else {
        product.discount = 0;
        product.final_price = product.price;
      }

      return product;

    } catch (error) {
      throw new Error('Error getting product by ID');
    }
  }

  async getAllProducts() {
    try {
      return await this.productRepository.getAll();
    } catch (error) {
      throw new Error('Error getting products');
    }
  }

  async createProduct(productData) {
    try {
      return await this.productRepository.create(productData);
    } catch (error) {
      throw new Error('Error creating product');
    }
  }

  async updateProduct(productId, updatedData) {
    try {
      return await this.productRepository.update(productId, updatedData);
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(productId) {
    try {
      return await this.productRepository.delete(productId);
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  async fetchDiscountInfo(discountType) {
    const discountInfoUrl = `https://64e7edd9b0fd9648b79066f8.mockapi.io/api/v1/discounts/apply`;
    const response = await axios.get(discountInfoUrl);
    const discountInfoList = response.data;
    return discountInfoList.find(item => item.id === discountType);
  }
}

module.exports = ProductService;
