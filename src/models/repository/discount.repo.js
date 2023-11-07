const { default: mongoose } = require('mongoose')
const discountModel = require('../discount.model')
const { objectIdParser } = require('../../utils')

class DiscountRepository {

    static async foundDiscountCodeByShopId(shopId, code) {
        return await discountModel.findOne({
            discount_shop_id: objectIdParser(shopId),
            discount_code: code
        }).lean()
    }


    static async deleteDiscount(filter) {
        return await discountModel.findOneAndDelete({ ...filter })
    }

    static async createNewDiscountCode(payload) {
        console.log(payload)
        return await discountModel.create({ ...payload })
    }

    static async findAllProduct(filter, limit, skip, selectOption, sortOption = {}) {
        return await discountModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select(selectOption)
            .sort(sortOption)
            .lean()
            .exec()
    }

    static async findDiscountCode(filter, limit, skip, selectOption, sortOption = {}) {
        return await discountModel.find(filter)
            .skip(skip)
            .limit(limit)
            .select(selectOption)
            .sort(sortOption)
            .lean()
            .exec()
    }

    static async disableDiscountCode(discountCodeId, shopId) {
        return await discountModel.findOneAndUpdate({
            _id: objectIdParser(discountCodeId),
            discount_shop_id: objectIdParser(shopId)
        }, {
            $set: {
                discount_is_active: false
            }
        }).lean()
    }

}

module.exports = DiscountRepository