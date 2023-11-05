

const ProductRepository = require('../models/repository/product.repo')
const ErrorResponse = require('../core/error.response');
const { getSelectDataForQuery, getUnselectDataForQuery, removeNullOrUnderfinedObject, objectIdParser } = require('../utils/index');
const { Types } = require('mongoose/lib');
const ProductFactory = require('../factories/Product Factory/product.factory')
const InventoryService = require('../services/inventory.service')
const { LIMIT_PER_PAGE } = require('../utils/pagination.option')

//-------------PRODUCT SERVICE--------------------
class ProductService {

    static createProduct = async (payload) => {
        const typeOfProduct = ProductFactory.getProduct(payload.product_type)
        const newProduct = await new typeOfProduct(payload).createProduct()
        console.log(newProduct)
        await InventoryService.createNewInventory(newProduct.product.product_shop_id, newProduct.product._id, newProduct.product.product_quantity)
        return newProduct
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
        const productClass = ProductFactory.getProduct(type)

        return await new productClass(payload).updateProduct(filter, payload)
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

module.exports = ProductService