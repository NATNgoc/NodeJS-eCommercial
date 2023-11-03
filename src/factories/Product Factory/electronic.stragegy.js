const Product = require('./product.stragegy')
const { filterPayLoad, isEmptyObject } = require('../../utils')
const ElectronicRepository = require('../../models/repository/electronic.repo')
const ErrorResponse = require('../../core/error.response');
class Electronic extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check your network")

        const newElectronicProduct = await ElectronicRepository.createElectronicProduct({ _id: newProduct._id, ...this.product_attribute, product_shop_id: this.product_shop_id })
        if (!newElectronicProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check your network")

        return {
            product: newProduct,
            product_attribute: await this.product_attribute
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
                ...updatedProduct,
                product_attribute: await this.updateElectronic(filter, product_atrribute)
            }
        }
        return {
            updatedProduct
        }
    }

    async updateElectronic(filter, payload) {
        const updatedElectronic = await ElectronicRepository.updateElectronic(filter, payload)
        if (!updatedElectronic) throw new ErrorResponse.ErrorResponse("Something went wrong")
        return updatedElectronic
    }
}

module.exports = Electronic