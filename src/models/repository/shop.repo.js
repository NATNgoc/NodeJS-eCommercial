const { default: mongoose } = require('mongoose')
const shopModel = require('../shop.model')
const { ObjectId } = require('mongodb')

class ShopRepository {
    /**
     * 
     * @param {*} shopId : "Id of shop you want to find"
     */
    static async findShopById(shopId) {
        return await shopModel.findById({ _id: new mongoose.Types.ObjectId(shopId) })
            .lean()
    }
}

module.exports = ShopRepository