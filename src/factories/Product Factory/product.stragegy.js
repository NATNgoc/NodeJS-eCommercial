
const ProductRepository = require('../../models/repository/product.repo')
const ErrorResponse = require('../../core/error.response');
class Product {
    constructor({ product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_attribute, product_shop_id }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop_id = product_shop_id;
        this.product_attribute = product_attribute
    }

    async createProduct() {
        return await ProductRepository.createProduct({
            product_name: this.product_name,
            product_thumb: this.product_thumb,
            product_description: this.product_description,
            product_price: this.product_price,
            product_quantity: this.product_quantity,
            product_type: this.product_type,
            product_shop_id: this.product_shop_id
        })
    }

    async updateProduct(filter, payload) {
        const updatedProduct = await ProductRepository.updateProduct(filter, payload)
        if (!updatedProduct) {
            throw new ErrorResponse.ErrorResponse("Something went wrong! Check again")
        }
        return updatedProduct
    }
}

module.exports = Product
