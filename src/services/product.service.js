

const ProductRepository = require('../models/repository/product.repo')
const ErrorResponse = require('../core/error.response')

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

        return await ProductRepository.createSpecificProductType("PRODUCT", {
            product_name: this.product_name,
            product_thumb: this.product_thumb,
            product_description: this.product_description,
            product_price: this.product_price,
            product_quantity: this.product_quantity,
            product_type: this.product_type,
            product_shop_id: this.product_shop_id
        })
    }

}

class Clothing extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check again")

        const newClothingProduct = await ProductRepository.createSpecificProductType("CLOTHING", { _id: newProduct._id, ...this.product_attribute, product_shop_id: this.product_shop_id })
        if (!newClothingProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check again")

        return {
            product: newProduct,
            ...this.product_attribute
        }
    }
}

class Electronic extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check your network")

        const newElectronicProduct = await ProductRepository.createSpecificProductType("ELECTRONIC", { _id: newProduct._id, ...this.product_attribute, product_shop_id: this.product_shop_id })
        if (!newElectronicProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check your network")

        return {
            product: newProduct,
            ...this.product_attribute
        }
    }
}


//-------------FACTORY PATTERN--------------------
class ProductFactory {

    static registeredClassType = {}

    static registerNewClassType = (type, classReference) => {
        ProductFactory.registeredClassType[type] = classReference
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.registeredClassType[type]
        if (!productClass) {
            throw new ErrorResponse.NotFoundError("Not valid type of product")
        }
        return await new ProductFactory.registeredClassType[type](payload).createProduct()
    }
}
//Registe all prodcuct class right here
ProductFactory.registerNewClassType('Electronic', Electronic)
ProductFactory.registerNewClassType('Clothing', Clothing)


//-------------PRODUCT SERVICE--------------------
class ProductService {
    static createProduct = async (payload) => {
        const type = payload.product_type
        return await ProductFactory.createProduct(type, payload)
    }
    static findAllDraftsProduct = async (productShopId, currentPage) => {

    }
}

module.exports = ProductService