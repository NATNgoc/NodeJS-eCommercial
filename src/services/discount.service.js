
const ErrorResponse = require("../core/error.response");
const DiscountRepository = require("../models/repository/discount.repo");
const ProductRepository = require("../models/repository/product.repo");
const { getSelectDataForQuery,
    getUnselectDataForQuery,
    objectIdParser } = require('../utils/index')
const { LIMIT_PER_PAGE } = require('../utils/pagination.option')

const findAvalibleProductForDiscount = {
    all: getProductForAll,
    specific: getProductForSpecific
}





//----------------------SUB FUNCTION--------------------

async function checkExistingCode(shopId, code) {
    const discountCode = await DiscountRepository.foundDiscountCodeByShopId(shopId, code)
    if (discountCode) throw new ErrorResponse.BadRequestError("Discount code is Exsited")
}

async function findExistingCode(shopId, code) {
    const discountCode = await DiscountRepository.foundDiscountCodeByShopId(shopId, code)
    if (!discountCode) throw new ErrorResponse.BadRequestError("Discount code is not exsited")
    return discountCode
}


async function getProductForAll(sortBy, page, limit, shopId, discountProductIds = []) {
    const filter = {
        product_shop_id: objectIdParser(shopId),
        isPublish: true
    }
    const unSelectField = ['createdAt', 'updatedAt', '__v']
    const sortOption = sortBy === 'ctime' ? { createdAt: 1 } : { updatedAt: -1 }
    const skip = limit * page
    return await ProductRepository.findAllProduct(filter, limit, skip, getUnselectDataForQuery(unSelectField), sortOption)
}

async function getProductForSpecific(sortBy, page, limit, shopId, discountProductIds) {
    const filter = {
        product_shop_id: objectIdParser(shopId),
        isPublish: true,
        _id: { $in: discountProductIds }
    }
    const unSelectField = ['createdAt', 'updatedAt', '__v']
    const sortOption = sortBy === 'ctime' ? { createdAt: -1 } : { createdAt: 1 }
    const skip = LIMIT_PER_PAGE * page
    return await ProductRepository.findAllProduct(filter, limit, skip, getUnselectDataForQuery(unSelectField), sortOption)
}

async function checkDateCode(currentDate, endDate, discountCodeId, shopId) {
    const result = currentDate > endDate
    if (!result) {
        await DiscountRepository.disableDiscountCode(discountCodeId, shopId)
        throw new ErrorResponse.BadRequestError("Discoutn code is Expired")
    }
}

async function isUserStillHasTurn(userId, usedUserIds, maxTurn) {
    const usedCountOfUser = usedUserIds.reduce((count, currentUserId) => (currentUserId === userId ? count + 1 : count), 0);
    return usedCountOfUser === maxTurn
}

function checkCodeIsActive(status) {
    if (!status) throw new ErrorResponse.BadRequestError("Discountcode is exprired")
}

function checkStillHaveDiscountTurn(remainingTurn) {
    if (remainingTurn === 0) throw new ErrorResponse.BadRequestError("Discount code turn is over")
}

function checkUserHaveEnoughTurn(maxTurnPerUser, usedUserIds, userId) {
    if (maxTurnPerUser !== 0) {
        if (!isUserStillHasTurn(userId, usedUserIds, maxTurnPerUser)) {
            throw new ErrorResponse.BadRequestError("User no longer has a turn")
        }
    }
}

function checkValidProductForDiscount(productId, typeApply, availibleProductIds) {
    if (typeApply === 'specific') {
        if (!IsValidProductForDiscount(productId, availibleProductIds)) {
            throw new ErrorResponse.BadRequestError("product is not in range for discount")
        }
    }
}

function IsValidProductForDiscount(produductId, availableProductIds) {
    return availableProductIds.includes(produductId)
}

function checkTotalPriceWithMinimumValue(totalValue, minimumValue) {
    if (totalValue < minimumValue) {
        throw new ErrorResponse.BadRequestError("Total Price is under minimum value of this discount")
    }
}

async function isValidateForApplyCode(userId, code, shopId, products) {
    const currentCode = await findExistingCode(shopId, code)
    const { productId, price, quantity } = products
    const totalPrice = price * quantity

    checkCodeIsActive(currentCode.discount_is_active)
    await checkDateCode(new Date(), new Date(currentCode.discount_end_at), currentCode._id, shopId)
    checkStillHaveDiscountTurn(currentCode.discount_max_uses)
    checkUserHaveEnoughTurn(currentCode.discount_max_use_per_user, currentCode.discount_users_used, userId)
    checkValidProductForDiscount(productId, currentCode.discount_apply_for, currentCode.discount_product_ids)
    checkTotalPriceWithMinimumValue(totalPrice, currentCode.discount_min_order_value)

    return true
}
//---------------------------------------------------------------------
/*
            ----DISCOUNT SERVICE-----
    1 - Generate discount code [shop | admin]
    2 - Get all product by code [user]
    3 - Get all discount code [user | shop]
    4 - Verify discount code [user]
    5 - Delete discount code [admin | shop]
    6 - Cancle discount code [user]
*/


//-----------------MAIN FUNCTION SERVICE-----------------------
class DiscountService {

    static async generateDiscountCode(payload, shopId) {
        await checkExistingCode(shopId, payload.discount_code)
        return await DiscountRepository.createNewDiscountCode({
            ...payload,
            discount_shop_id: shopId
        })
    }

    static async getAllProductByDiscountCode({ sortBy = 'ctime', page = 0, limit = 20 }, code, shopId) {
        /*
        1 - mã cho all product
        2 - mã cho từng specific product
        */
        const discountCode = await findExistingCode(shopId, code)
        if (!discountCode) throw new ErrorResponse.BadRequestError('Code is not existed!')
        console.log(discountCode)
        return await findAvalibleProductForDiscount[discountCode.discount_apply_for](sortBy, page, limit, shopId, discountCode.discount_product_ids)
    }

    static async getAllDiscountCodeForShop({ sortBy = 'ctime', page = 0, limit = 10 }, shopId) {
        const filter = {
            discount_shop_id: objectIdParser(shopId)
        }
        const sortOption = sortBy === 'ctime' ? { createdAt: 1 } : { createdAt: -1 }
        const skip = page * limit
        const unSelectField = ['__v']
        return await DiscountRepository.findDiscountCode(filter, limit, skip, getUnselectDataForQuery(unSelectField), sortOption)
    }


    /**
     * 
     * @param {*} userId : "Userid that person is want to use discount code"
     * @param {*} code : "The discount code"
     * @param {*} shopId :"The id of the shop that issued this discount code"
     * @param {*} products : "It is object include productId, price and quantity"
     */
    static async applyDiscountCodeForProduct(userId, code, shopId, products) {
        const { price, quantity } = products
        const totalPrice = price * quantity
        if ((await isValidateForApplyCode(userId, code, shopId, products))) {
            const totalDiscountPrice = currentCode.discount_type === 'specific' ? (totalPrice * currentCode.discount_value / 100) : currentCode.discount_value
            return {
                "Discounted Price": totalDiscountPrice,
                "Initial Price": totalPrice,
                "Final Price: ": totalPrice - totalDiscountPrice
            }
        }
        throw ErrorResponse.ErrorResponse("Something went wrong!!")
    }



}
module.exports = DiscountService