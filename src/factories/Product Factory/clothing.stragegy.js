const Product = require('./product.stragegy')
const { filterPayLoad, isEmptyObject } = require('../../utils')
const ClothingRepository = require('../../models/repository/clothing.repo')
const ErrorResponse = require('../../core/error.response');
class Clothing extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check again")

        const newClothingProduct = await sClothingRepository.createClothingProduct({ _id: newProduct._id, ...this.product_attribute, product_shop_id: this.product_shop_id })
        if (!newClothingProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check again")

        return {
            product: newProduct,
            product_attribute: this.product_attribute
        }
    }

    async updateProduct(filter, payload) {
        let { product_atrribute, ...rest } = payload
        product_atrribute = filterPayLoad(product_atrribute)
        rest = filterPayLoad(rest)
        const updatedProduct = await super.updateProduct(filter, rest)
        // check if the user is updating product_attribute
        if (!isEmptyObject(product_atrribute)) {
            return {
                product: updatedProduct,
                product_attribute: await this.updatedClothing(filter, product_atrribute)
            }
        }
        return {
            updatedProduct
        }
    }

    async updateClothing(filter, payload) {
        const updatedClothing = await ClothingRepository.updateClothing(filter, payload)
        if (!updatedClothing) throw new ErrorResponse.ErrorResponse("Something went wrong")
        return {
            updateClothing
        }
    }
}

module.exports = Clothing