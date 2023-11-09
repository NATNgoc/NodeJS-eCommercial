

const CartService = require('../services/cart.service')
const SuccesResponse = require('../core/success.response')
const { HEADER } = require('../auth/authUtils')

class CartController {
    addToCart = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            ...req.body,
            message: "Add to cart succesfully",
            metaData: await CartService.AddProductToCart(req.body.product_id, req.headers[HEADER.client_id])
        }).send(res)
    }
    updateProductQuantity = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            ...req.body,
            message: "Increase Quantity Product in cart succesfully",
            metaData: await CartService.updateProductQuantityInCart(req.headers[HEADER.client_id], { ...req.body })
        }).send(res)
    }

    removeProductFromCart = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            ...req.body,
            message: "Remove Product from cart succesfully",
            metaData: await CartService.removeProductFromCart(req.headers[HEADER.client_id], req.params.productId)
        }).send(res)
    }

    findCartByUserId = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            ...req.body,
            message: "Increase Quantity Product in cart succesfully",
            metaData: await CartService.findActiveCartByUserId(req.headers[HEADER.client_id])
        }).send(res)
    }
}
const cartController = new CartController()
module.exports = cartController