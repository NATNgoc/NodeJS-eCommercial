const shopModel = require('../models/shop.model')
const { getInfoData } = require('../utils')
const TokenService = require('./token.service')
const bcrypt = require('bcrypt')
const roles = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}
class AccessService {

    static signUp = async ({ name, email, password }) => {

        const currentShop = await shopModel.findOne({ email }).lean()
        if (currentShop) {
            return {
                code: "404",//
                message: 'Shop already registered'
            }
        }
        //Hash mật khẩu ra để lưu xuống db
        const hashedPassword = await bcrypt.hash(password, 10)
        //Khởi tạo newShop
        const newShop = await shopModel.create({
            name, email, password: hashedPassword, roles: [roles.SHOP]
        })
        console.log(getInfoData(['name', 'email'], newShop))
        //New shop Được tạo thành công
        if (newShop) {
            const { accessToken, refreshToken } = await TokenService.genToken(newShop)
            console.log({ accessToken, refreshToken })
            console.log("Create token success::::", { accessToken, refreshToken })
            return {
                code: 201,
                message: "Đăng kí thành công",
                metadata: {
                    shop: getInfoData(['name', 'email'], newShop),
                    accessToken: accessToken,
                    refreshKey: refreshToken
                }
            }
        }
        return {
            code: 404,
            message: "Đăng kí thất bại",
        }
    }

    static login = async ({ email, password }) => {

    }

}

module.exports = AccessService