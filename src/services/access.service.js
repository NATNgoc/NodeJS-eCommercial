const shopModel = require('../models/shop.model')
const shopService = require('./shop.service')
const { getInfoData } = require('../utils')
const TokenService = require('./token.service')
const bcrypt = require('bcrypt')
const errorHanlder = require('../core/error.response')
const utils = require('../utils/index')
const roles = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN'
}
const { actionTokenService } = require('../utils/index')
//----------------MAIN SERVICE FUNCTION--------------------------------------
class AccessService {

    static signUp = async ({ name, email, password }) => {
        //Kiểm tra shop đã đăng ký chưa
        if (await isRegisteredShop(email)) throw new errorHanlder.ConflictRequestError("Error: Shop already registered")
        //Tạo shop
        return await createNewShop(name, email, password, [roles.SHOP])
    }


    static login = async ({ email, password, refreshTokenCookie = null }) => {
        //refreshToken được truyền vào lại khi refreshToken còn lưu trữ trong cookies, không cần truy cập lại db
        const shop = await isValidateForLogin(email, password)
        if (!utils.isEmptyObject(shop)) {
            const { accessToken, refreshToken } = await genTokenForShop(shop)
            return {
                accessToken,
                refreshToken
            }
        }
        throw new errorHanlder.NotFoundError('Something went wrong!! pls check again')
    }

    static logout = async (keyStore) => {
        const delKey = await TokenService.removeTokenById(keyStore._id)
        console.log(delKey)
        return { delKey }
    }

    static refreshToken = async (keyStore, refreshToken, shop) => {
        const currentShop = await isValidateForRefreshToken(keyStore, refreshToken, shop)
        if (!utils.isEmptyObject(currentShop)) {
            return await handleRefresingToken(currentShop, keyStore)
        }
        throw new errorHanlder.NotFoundError('Something went wrong')
    }

}
//----------------SUB SERVICE FUNCTION--------------------------------------
async function handleRefresingToken(shop, keyStore) {
    const { accessToken, refreshToken } = await TokenService.genToken(shop, actionTokenService["REFRESH_TOKEN"], keyStore)
    console.log("Key store", keyStore)
    return {
        accessToken, refreshToken
    }
}

async function isValidateForRefreshToken(keyStore, refreshToken, shop) {
    const { email } = shop
    //check refreshToken đã sử dụng chưa
    if (isUsedRefreshToken(keyStore, refreshToken)) {
        await hanldeForUsedRefreshToken(keyStore)
    }

    //check có khớp refreshToken ở db không
    if (keyStore.refreshToken !== refreshToken) {
        throw new errorHanlder.ForBiddenRequestError('invalid refresh token')
    }

    const currentShop = isRegisteredShop(email)
    if (!currentShop) throw new errorHanlder.NotFoundError("Shop isn't register")
    return currentShop
}

async function isValidateForLogin(email, password) {
    // 1 - check shop đã đăng ký chưa
    // 2 - match password
    const shop = await isRegisteredShop(email)
    if (!shop) {
        throw new errorHanlder.AuthError("Shop isn't registered!!!")
    }
    if (!await isCorrectPassword(password, shop.password)) throw new errorHanlder.AuthError("Not correct password")

    //if have validation for login, retrun shop
    return shop
}

async function hanldeForUsedRefreshToken(keyStore) {
    await TokenService.removeTokenByUserId(keyStore.userid)
    throw new errorHanlder.ForBiddenRequestError('Something went wrong! please login again')
}

function isUsedRefreshToken(keyStore, keyCheck) {
    return keyStore.refreshTokenUsed.includes(keyCheck)
}

async function createNewShop(name, email, password, roles) {
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

async function genTokenForShop(shop) {
    const { accessToken, refreshToken } = await TokenService.genToken(shop)
    return {
        shop: getInfoData(['name', 'email'], shop),
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

async function isCorrectPassword(password, correctPassword) {
    const match = await bcrypt.compare(password, correctPassword)
    if (!match) {
        return false
    }
    return true
}


async function isRegisteredShop(email) {
    // const currentShop = await shopModel.findOne({ email }).select({ _id: 1, name: 1, email: 1, password: 1 }).lean() || {}
    const currentShop = await shopService.findByEmail(email)
    if (!currentShop) {
        return false
    }
    return currentShop;
}

async function hashStringByBcrypt(string) {
    return await bcrypt.hash(string, 10)
}

module.exports = { AccessService, isRegisteredShop }