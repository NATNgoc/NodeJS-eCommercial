const { default: mongoose } = require('mongoose')
const tokenModel = require('../token.model')

class TokenRepository {
    /**
     * 
     * @param {*} shopId : "Id shop of key store you want to find"
     */
    static async findKeyStoreByShopId(shopId) {
        return await tokenModel.findOne({ _id: new mongoose.Types.ObjectId(shopId) })
            .lean()
            .exec()
    }
}

module.exports = TokenRepository