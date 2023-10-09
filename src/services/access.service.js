const shopModel = require('../models/shop.model')
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

        const hashedPassword = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: hashedPassword, roles: [roles.SHOP]
        })

        if (newShop) // Được tạo thành công
        {

        }
    }

}