const ErrorResponse = require("../core/error.response");
const CartRepository = require("../models/repository/cart.repo");
const ProductRepository = require("../models/repository/product.repo");
const { getSelectDataForQuery,
    getUnselectDataForQuery,
    objectIdParser } = require('../utils/index')
const cartStatus = {
    ACTIVE: "active",
    PENDING: "pending",
    FAILED: "failed",
    COMPLETED: "completed",
}
//--------------------SUB FUNCTION----------------------------
async function checkValidProductForAddToCart(productId, userId) {
    const requiredProduct = await ProductRepository.findProductById({ product_id: productId })
    console.log(productId, requiredProduct)
    if (!requiredProduct) throw new ErrorResponse.BadRequestError("Product is not existed")
    return requiredProduct
}

async function checkCart(userId) {
    let cart = await CartRepository.findCartByUserId(userId)
    if (!cart) {
        cart = CartRepository.createCart({ cart_user_id: objectIdParser(userId) })
    }
    if (cart.cart_status === cartStatus.FAILED) throw new ErrorResponse.ForBiddenRequestError("Cart is currently locked!Pls contact hotline ShopDev")
    return cart
}

async function addNewProductToCart(cartId, product) {
    const bodyUpdate = {
        $push: {
            cart_products: {
                product_id: product._id,
                price: product.product_price,
                shop_id: product.product_shop_id,
                quantity: 1
            }
        }
    }
    const filter = {
        _id: cartId
    }
    return await CartRepository.updateSpecificCart(filter, bodyUpdate, {})
}

async function addOldProductToCart(cartId, productId) {
    const bodyUpdate = {
        $inc: {
            "cart_products.$.quantity": 1
        }
    }
    const filter = {
        _id: cartId,
        "cart_products.product_id": objectIdParser(productId),
    }
    return await CartRepository.updateSpecificCart(filter, bodyUpdate, {})
}

async function checkProductInCartProduct(productIdToCheck, productInCart) {
    for (const product of productInCart) {
        if (product.product_id.toString() === productIdToCheck.toString()) {
            return true;
        }
    }
    return false;
}

async function findCartWithUserIdAndProductId(userId, productId) {
    const filter = {
        cart_user_id: objectIdParser(userId),
        cart_status: 'active',
        'cart_products.product_id': objectIdParser(productId)
    }
    const unSelectField = ['createdAt', 'updatedAt', '__v']
    return await CartRepository.findCartWithUnSelectField(filter, getUnselectDataForQuery(unSelectField))
}

async function findCartWithUserIdAndProductId(userId, productId) {
    const filter = {
        cart_user_id: objectIdParser(userId),
        cart_status: 'active',
        'cart_products.product_id': objectIdParser(productId)
    }
    const unSelectField = ['createdAt', 'updatedAt', '__v']
    return await CartRepository.findCartWithUnSelectField(filter, getUnselectDataForQuery(unSelectField))
}

async function updateQuantityProduct(cartId, productId, quantity) {
    const filter = {
        _id: cartId,
        "cart_products.product_id": objectIdParser(productId)
    }
    const bodyUpdate = {
        $set: {
            "cart_products.$.quantity": quantity
        }
    }
    return await CartRepository.updateSpecificCart(filter, bodyUpdate, {})
}

async function removeProductFromCart(cartId, productId) {
    const filter = {
        _id: cartId
    };

    const bodyUpdate = {
        $pull: {
            "cart_products": {
                "product_id": objectIdParser(productId)
            }
        }
    };

    return await CartRepository.updateSpecificCart(filter, bodyUpdate, {});
}

//--------------------MAIN FUNCTION-------------------------
class CartService {

    /*
            ---------CARTPRODUCT SERVICE-------------
            1. ADD PRODUCT TO CART [USER]
            2. INCREASE QUATITY PRODUCT IN CART
            3. REDUCE QUANITTY PRODUCT IN CART
            
    */

    static async createNewCart(body) {
        return await CartRepository.createCart(body)
    }

    static async updateProductQuantityInCart(userId, { product_id, newQuantity }) {
        const cart = await findCartWithUserIdAndProductId(userId, product_id)
        if (!cart) {
            throw new ErrorResponse.NotFoundError("Not found valid product")
        }
        if (newQuantity <= 0) {
            return await removeProductFromCart(cart._id, product_id)
        } else {
            return await updateQuantityProduct(cart._id, product_id, newQuantity)
        }

    }


    static async AddProductToCart(productId, userId) {
        const product = await checkValidProductForAddToCart(productId, userId)
        const cart = await checkCart(userId)
        console.log(product._id, cart.cart_products)
        const hasProductInCart = await checkProductInCartProduct(product._id, cart.cart_products)
        console.log("hasProductInCart", hasProductInCart)
        if (hasProductInCart) {
            return await addOldProductToCart(cart._id, product._id)
        } else {
            return await addNewProductToCart(cart._id, product)
        }
    }
}

module.exports = CartService