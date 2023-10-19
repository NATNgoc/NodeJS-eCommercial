const shopModel = require('../models/shop.model')
const shopService = require('./shop.service')
const { getInfoData } = require('../utils')
const TokenService = require('./token.service')
const bcrypt = require('bcrypt')
const errorHanlder = require('../core/error.response')
const tokenModel = require('../models/token.model')
const roles = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}

const isRegisteredShop = async (email) => {
    const currentShop = await shopModel.findOne({ email }).select({ _id: 1, name: 1, email: 1, password: 1 }).lean() || {}
    if (isEmptyObject(currentShop)) {
        return false
    }
    return currentShop;
}

const isEmptyObject = (object) => {
    return Object.keys(object).length === 0
}

const hashStringByBcrypt = async (string) => {
    return await bcrypt.hash(string, 10)
}

const createNewShop = async (name, email, password, roles) => {
    /*
    1 - hash password
    2 - Insert newShop vào db
    3 - check succes sau đó trả về token nếu success không thì throw error
    */
    const hashedPassword = await hashStringByBcrypt(password)
    const newShop = await shopModel.create({
        name, email, password: hashedPassword, roles
    })
    //New shop Được tạo thành công
    if (newShop) {
        return await genTokenForShop(newShop)
    }
    throw new errorHanlder.NotFoundError("Not success creating for shop")
}

const isCorrectPassword = async (password, correctPassword) => {
    const match = await bcrypt.compare(password, correctPassword)
    if (!match) {
        return false
    }
    return true
}

const genTokenForShop = async (shop) => {
    const { accessToken, refreshToken } = await TokenService.genToken(shop)
    console.log({ accessToken, refreshToken })
    console.log("Create token success::::", { accessToken, refreshToken })
    return {
        shop: getInfoData(['name', 'email'], shop),
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        //Kiểm tra shop đã đăng ký chưa
        if (await isRegisteredShop(email)) throw new errorHanlder.ConflictRequestError("Error: Shop already registered")
        //Tạo shop
        return await createNewShop(name, email, password, [roles.SHOP])
    }

    //refreshToken được truyền vào lại khi refreshToken còn lưu trữ trong cookies, không cần truy cập lại db
    static login = async ({ email, password, refreshTokenCookie = null }) => {
        /*
        1 - check shop đã đăng ký chưa
        2 - match password
        3 - create AT vs RT and save
        4 - generate tokens
        5 - get data return login 
        */
        const shop = await isRegisteredShop(email)
        if (!shop) {
            throw new errorHanlder.AuthError("Shop isn't registered")
        }

        if (!await isCorrectPassword(password, shop.password)) throw new errorHanlder.AuthError("Not correct password")

        const { accessToken, refreshToken } = await genTokenForShop(shop)
        return {
            accessToken,
            refreshToken
        }
    }


    static logout = async (keyStore) => {
        const delKey = await TokenService.removeTokenById(keyStore._id)
        console.log(delKey)
        return { delKey }
    }

    static refreshToken = async (keyStore, refreshToken, shop) => {
        console.log({ keyStore, refreshToken, shop })
        const { userid, email } = shop
        //check refreshToken đã sử dụng chưa
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            TokenService.removeTokenByUserId(keyStore.userid)
            throw new errorHanlder.ForBiddenRequestError('Something went wrong! please login again')
        }

        //check khớp refreshToken
        if (keyStore.refreshToken !== refreshToken) {
            throw new errorHanlder.ForBiddenRequestError('invalid refresh token')
        }

        const currentShop = await shopService.findByEmail(email)
        if (!currentShop) throw new errorHanlder.NotFoundError("shop isn't register")
        return await TokenService.genToken(currentShop)
    }

}

module.exports = AccessService