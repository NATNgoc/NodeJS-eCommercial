
const SuccesResponse = require('../core/success.response')
const ProductService = require('../services/product.service')
const { HEADER } = require('../auth/authUtils')
class ProductController {
    createProduct = async (req, res, next) => {
        return new SuccesResponse.CreatedResponse({
            message: "Create Product Successfully!",
            metaData: await ProductService.createProduct({ ...req.body, product_shop_id: req.headers[HEADER.client_id] })
        }).send(res)
    }
    findAllDraftsProduct = async (req, res, next) => {
        const currentPage = req.query.page || 0
        return new SuccesResponse.OkResponse({
            message: "List of draft Product!",
            metaData: await ProductService.findAllDraftsProducts(req.headers[HEADER.client_id], req.query)
        }).send(res)
    }
    findAllPublishedProducts = async (req, res, next) => {
        const currentPage = req.query.page || 0
        return new SuccesResponse.OkResponse({
            message: "List of publish Product!",
            metaData: await ProductService.findAllPublishProducts(req.headers[HEADER.client_id], req.query)
        }).send(res)
    }
    publishProduct = async (req, res, next) => {
        const productId = req.params.id
        return new SuccesResponse.OkResponse({
            message: "Publish product succesfully!",
            metaData: await ProductService.publishProduct(req.headers[HEADER.client_id], productId)
        }).send(res)
    }
    unPublishProduct = async (req, res, next) => {
        const productId = req.params.id
        return new SuccesResponse.OkResponse({
            message: "UnPublish product succesfully!",
            metaData: await ProductService.unPublishProduct(req.headers[HEADER.client_id], productId)
        }).send(res)
    }

    searchProductByKeyword = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            message: "Search Result!",
            metaData: await ProductService.searchProductByKeyword(req.query)
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            message: "All Products!",
            metaData: await ProductService.findAllProduct(req.query)
        }).send(res)
    }
    findProductById = async (req, res, next) => {
        console.log(req.params)
        return new SuccesResponse.OkResponse({
            message: "All Products!",
            metaData: await ProductService.findProductById(req.params)
        }).send(res)
    }
}

module.exports = new ProductController()