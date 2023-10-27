
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
            metaData: await ProductService.findAllDraftsProduct(req.headers[HEADER.client_id], currentPage)
        }).send(res)
    }
}

module.exports = new ProductController()