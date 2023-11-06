const { default: mongoose } = require('mongoose')
const discountModel = require('../discount.model')
const { objectIdParser } = require('../../utils')

class DiscountRepository {

    static async foundDiscountCodeByShopId(shopId, code) {
        return discountModel.findOne({
            discount_shop_id: objectIdParser(shopId),
            discount_code: code
        }).lean()
    }


    static async createNewDiscountCode(payload) {
        console.log(payload)
        return discountModel.create({ ...payload })
    }

    static async findAllProduct(filter, limit, skip, selectOption, sortOption = {}) {
        return discountModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select(selectOption)
            .sort(sortOption)
            .lean()
            .exec()
    }

    static async findDiscountCode(filter, limit, skip, selectOption, sortOption = {}) {
        return discountModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select(selectOption)
            .sort(sortOption)
            .lean()
            .exec()
    }

}

module.exports = DiscountRepository