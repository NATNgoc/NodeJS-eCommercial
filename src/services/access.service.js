const shopModel = require('../models/shop.model')
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
                code: "Do team quy ddinh",
                message: 'Shop already registered'
            }
        }

        //Hash mật khẩu ra để lưu xuống db
        const hashedPassword = await bcrypt.hash(password, 10)

        //Khởi tạo newShop
        const newShop = await shopModel.create({
            name, email, password: hashedPassword, roles: [roles.SHOP]
        })
        console.log(newShop)

        //New shop Được tạo thành công
        if (newShop) {
            const tokenAccess = await TokenService.genToken(newShop)
            return {
                message: "Đăng kí thành công",
                jwt: tokenAccess
            }
        }

    }

    static login = async ({ email, password }) => {

    }

}

module.exports = AccessService