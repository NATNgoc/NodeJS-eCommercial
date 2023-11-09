const cartModel = require('../cart.model')

class CartRepository {

    static async createCart(body) {
        return await cartModel.create({ ...body })
    }

    static async findCartByUserId(userId) {
        return await cartModel.findOne({ cart_user_id: userId }).lean()
    }

    static async updateSpecificCart(filter, bodyUpdate, { isUpsert = false, isNew = true }) {
        return await cartModel.findOneAndUpdate({ ...filter }, { ...bodyUpdate }, { upsert: isUpsert, new: isNew })
    }

    static async findCartWithUnSelectField(filter, unSelectField) {
        return await cartModel
            .findOne({ ...filter })
            .select(unSelectField)
            .lean()
    }

}

module.exports = CartRepository