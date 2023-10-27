const { default: mongoose } = require('mongoose')
const shopModel = require('../shop.model')

class ShopRepository {
    /**
     * 
     * @param {*} shopId : "Id of shop you want to find"
     */
    static async findShopById(shopId) {
        return await shopModel.findOne({ _id: new mongoose.Types.ObjectId(shopId) })
            .lean()
            .exec()
    }
}

module.exports = ShopRepository