const shopModel = require('../models/shop.model')
const shopService = require('./shop.service')
const { getInfoData } = require('../utils')
const TokenService = require('./token.service')
const bcrypt = require('bcrypt')
const errorHanlder = require('../core/error.response')
const roles = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}
class AccessService {

    static signUp = async ({ name, email, password }) => {
        console.log("SHOP ALREADY REGISTERED")
        const currentShop = await shopModel.find({ email }).lean()
        if (currentShop.length > 0) {
            throw new errorHanlder.ConflictRequestError("Error: Shop already registered")
        }
        //Hash mật khẩu ra để lưu xuống db
        const hashedPassword = await bcrypt.hash(password, 10)
        //Khởi tạo newShop
        const newShop = await shopModel.create({
            name, email, password: hashedPassword, roles: [roles.SHOP]
        })

        //New shop Được tạo thành công
        if (newShop) {
            const { accessToken, refreshToken } = await TokenService.genToken(newShop)
            console.log({ accessToken, refreshToken })
            console.log("Create token success::::", { accessToken, refreshToken })
            return {
                shop: getInfoData(['name', 'email'], newShop),
                accessToken: accessToken,
                refreshToken: refreshToken,
                refreshTokenUsed: []
            }
        }
        throw new errorHanlder.NotFoundError()
    }

    //refreshToken được truyền vào lại khi refreshToken còn lưu trữ trong cookies, không cần truy cập lại db
    static login = async ({ email, password, refreshTokenCookie = null }) => {
        /*
        1 - check email in db
        2 - match password
        3 - create AT vs RT and save
        4 - generate tokens
        5 - get data return login 
        */
        const shop = await shopModel.find({ email }).select({ _id: 1, name: 1, email: 1, password: 1 }).lean()
        if (shop.length === 0) {
            throw new errorHanlder.AuthError("Shop isn't registered")
        }
        const match = await bcrypt.compare(password, shop[0].password)
        if (!match) {
            throw new errorHanlder.AuthError("Not correct password")
        }
        const { accessToken, refreshToken } = await TokenService.genToken(shop)
        return {
            accessToken,
            refreshToken
        }
    }

}

module.exports = AccessService