

const ProductRepository = require('../models/repository/product.repo')
const ErrorResponse = require('../core/error.response');
const { default: mongoose } = require('mongoose');
const { getSelectDataForQuery, getUnselectDataForQuery } = require('../utils/index')


const LIMIT_PER_PAGE = 60

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
//Regist prodcuct class right here
ProductFactory.registerNewClassType('Electronic', Electronic)
ProductFactory.registerNewClassType('Clothing', Clothing)


//-------------PRODUCT SERVICE--------------------
class ProductService {

    static createProduct = async (payload) => {
        const type = payload.product_type
        return await ProductFactory.createProduct(type, payload)
    }

    static findProductById = async ({ product_id }) => {
        const unSelect = getUnselectDataForQuery(["__v", "isDraft", "isPublish", "createdAt", "updatedAt"])
        return await ProductRepository.findProductById({ product_id, unSelect })
    }

    static findAllDraftsProducts = async (productShopId, { page }) => {
        const filter = { product_shop_id: new mongoose.Types.ObjectId(productShopId), isDraft: true }
        const limit = limitProductPerPage
        const skip = page * limit
        return await ProductRepository.findProduct(filter, limit, skip)
    }
    static findAllPublishProducts = async (productShopId, { page }) => {
        const filter = { product_shop_id: new mongoose.Types.ObjectId(productShopId), isPublish: true }
        const limit = LIMIT_PER_PAGE
        const skip = page * limit
        return await ProductRepository.findProduct(filter, limit, skip)
    }

    static publishProduct = async (shopId, productId) => {
        const result = await ProductRepository.updateProductByShopId(productId, shopId, {
            isDraft: false,
            isPublish: true
        })
        if (!result) {
            throw new ErrorResponse.NotFoundError("Not found 404 error")
        }
        return result;
    }
    static unPublishProduct = async (shopId, productId) => {
        const result = await ProductRepository.updateProductByShopId(productId, shopId, {
            isDraft: true,
            isPublish: false
        })
        if (!result) {
            throw new ErrorResponse.NotFoundError("Not found 404 error")
        }
        return result;
    }

    static searchProductByKeyword = async ({ keyword, page }) => {
        keyword = keyword ? keyword : {}
        page = page ? page : 0
        // const regKeyword = RegExp(keyword)
        const filter = {
            isPublish: true,
            $text: { $search: keyword },
        }
        const limit = LIMIT_PER_PAGE
        const skip = page * limit
        const sortOption = {
            score: { $meta: "textScore" }
        }
        return await ProductRepository.findProduct(filter, limit, skip, sortOption)
    }

    static findAllProduct = async ({ sortBy = 'ctime', page = 0 }) => {
        const limit = LIMIT_PER_PAGE
        const filter = { isPublish: true }
        const sortOption = (sortBy === 'ctime') ? { updatedAt: 1 } : { createdAt: 1 }
        const skip = limit * page
        const select = getSelectDataForQuery(["product_name", "product_thumb", "product_description", "product_price", "product_quantity", "product_type"])
        return await ProductRepository.findAllProduct(filter, limit, skip, select, sortOption)
    }


}

module.exports = ProductService