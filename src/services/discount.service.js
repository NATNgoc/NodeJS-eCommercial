
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




}
module.exports = DiscountService