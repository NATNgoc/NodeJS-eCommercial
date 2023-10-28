const shopModel = require('../models/shop.model')

class ShopService {

    static async findByEmail(email, optionSelect = { email: 1, password: 1, name: 1, status: 1, roles: 1 }) {
        return await shopModel.findOne({ email }).select(optionSelect).lean()
    }

}

module.exports = ShopService