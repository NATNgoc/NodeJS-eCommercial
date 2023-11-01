

const ProductRepository = require('../models/repository/product.repo')
const ClothingRepository = require('../models/repository/clothing.repo')
const ElectronicRepository = require('../models/repository/electronic.repo')

const ErrorResponse = require('../core/error.response');
const { default: mongoose } = require('mongoose');
const { getSelectDataForQuery, getUnselectDataForQuery, nestedObjectParser, removeNullOrUnderfinedObject, objectIdParser, filterFieldsByPrefix, isEmptyObject } = require('../utils/index');
const { Types } = require('mongoose/lib');
const clothingModel = require('../models/clothing.model');
const electronicModel = require('../models/electronic.model');


const LIMIT_PER_PAGE = 60

//-----------------STRAGEGY PATTERN----------------------
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

class Clothing extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check again")

        const newClothingProduct = await ClothingRepository.createClothingProduct({ _id: newProduct._id, ...this.product_attribute, product_shop_id: this.product_shop_id })
        if (!newClothingProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check again")

        return {
            product: newProduct,
            ...this.product_attribute
        }
    }

    async updateProduct(filter, payload) {
        const { result, remaining } = filterFieldsByPrefix(payload, "product_attribute")
        const updatedProduct = await super.updateProduct(filter, remaining)
        //check if the user is updating product_attribute
        if (!isEmptyObject(result)) {
            return {
                ...updatedProduct,
                product_attribute: await updateClothing(filter, payload)
            }
        }
        return {
            updatedProduct
        }
    }

    async updateClothing(filter, payload) {
        const updateClothing = await ClothingRepository.updateClothing(filter, payload)
        return {
            updateClothing
        }
    }
}

class Electronic extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check your network")

        const newElectronicProduct = await ElectronicRepository.createElectronicProduct({ _id: newProduct._id, ...this.product_attribute, product_shop_id: this.product_shop_id })
        if (!newElectronicProduct) throw ErrorResponse.ErrorResponse("Something went wrong! Check your network")

        return {
            product: newProduct,
            ...this.product_attribute
        }
    }

    async updateProduct(filter, payload) {
        const { result, remaining } = filterFieldsByPrefix(payload, "product_attribute")
        const updatedProduct = await super.updateProduct(filter, remaining)
        //check if the user is updating product_attribute
        if (result) {
            const updatedElectronic = await this.updateElectronic(filter, payload)
            if (!updatedElectronic) throw new ErrorResponse("Something went wrong")
            return {
                ...updatedProduct,
                updatedElectronic
            }
        }
        return {
            updatedProduct
        }
    }

    async updateElectronic(filter, payload) {
        const updatedElectronic = await ElectronicRepository.updateElectronic(filter, payload)
        if (!updatedElectronic) throw new ErrorResponse("Something went wrong")
        return updatedElectronic
    }
}


//-------------FACTORY PATTERN--------------------
class ProductFactory {

    static registeredClassType = {}

    static registerNewClassType = (type, classReference) => {
        ProductFactory.registeredClassType[type] = classReference
    }

    static getProduct(type) {
        const productClass = ProductFactory.registeredClassType[type]
        if (!productClass) {
            throw new ErrorResponse.NotFoundError("Not valid type of product")
        }
        return productClass
    }
}
//Regist prodcuct class right here
ProductFactory.registerNewClassType('Electronic', Electronic)
ProductFactory.registerNewClassType('Clothing', Clothing)


//-------------PRODUCT SERVICE--------------------
class ProductService {

    static createProduct = async (payload) => {

        const type = payload.product_type
        const typeOfProduct = ProductFactory.getProduct(type)
        return await new typeOfProduct(payload).createProduct()
    }

    static findProductById = async ({ product_id }) => {
        const unSelect = getUnselectDataForQuery(["__v", "isDraft", "isPublish", "createdAt", "updatedAt"])
        return await ProductRepository.findProductById({ product_id, unSelect })
    }

    static updateProductById = async (type, productId, shopId, payload) => {
        const filter = {
            _id: objectIdParser(productId),
            product_shop_id: objectIdParser(shopId)
        }
        const checkedPayload = filterPayLoad(payload)
        const typeOfProduct = ProductFactory.getProduct(type)

        return await new typeOfProduct(payload).updateProduct(filter, checkedPayload)
    }

    static findAllDraftsProducts = async (productShopId, { page }) => {
        const filter = { product_shop_id: objectIdParser(productShopId), isDraft: true }
        const limit = limitProductPerPage
        const skip = page * limit
        return await ProductRepository.findProduct(filter, limit, skip)
    }

    static findAllPublishProducts = async (productShopId, { page }) => {
        const filter = { product_shop_id: objectIdParser(productShopId), isPublish: true }
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


//------------------SUB-FUNCTION--------------------------
/**
 * 
 * @param {*} payload : "The body payload you want to check before update to keep data preservation "
 * @returns :"Return the payload that be cleared and be ready for update section"
 */
function filterPayLoad(payload) {
    const parseredPayload = nestedObjectParser(payload)
    return removeNullOrUnderfinedObject(parseredPayload)
}

module.exports = ProductService