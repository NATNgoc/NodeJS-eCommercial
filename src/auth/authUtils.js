const jwt = require("jsonwebtoken")
const errorHandler = require("../core/error.response")
const TokenService = require("../services/token.service")
const { Types } = require('mongoose')
const crypto = require('crypto')
const HEADER = {
    client_id: 'x-client-id',
    autherization: 'authorization',
    refreshToken: 'x-rtoken-id'
}
const ShopRepository = require('../models/repository/shop.repo')
const TokenRepository = require('../models/repository/token.repo')

const authentication = async (req, res, next) => {
    /*
    1 - check valid userId
    2- check keyStore
    3 - hanlde for refreshToken Or accessToken
    */

    await checkIsValidShopId(req.headers[HEADER.client_id])

    const keyStore = await checkShopIsLogin(req.headers[HEADER.client_id])
    req.keyStore = keyStore

    //check if it's for refreshToken task
    if (req.headers[HEADER.refreshToken]) {
        await checkRefreshToken(keyStore, req)
    } else {
        await checkAccessToken(keyStore, req.headers[HEADER.autherization], req.headers[HEADER.client_id])
    }
    return next()
}

const checkIsValidShopId = async (shopId) => {
    if (!shopId) {
        throw new errorHandler.ForBiddenRequestError("invalid user id")
    }
    await checkShopIsRegistered(shopId)
}

const checkShopIsLogin = async (shopId) => {
    const keyStore = await TokenRepository.findKeyStoreByShopId(shopId)
    if (!keyStore) {
        throw new errorHandler.AuthError("User isn't login!")
    }
    return keyStore
}

const checkShopIsRegistered = async (shopId) => {
    let currentShop = await ShopRepository.findShopById(shopId)
    if (!currentShop) {
        throw new errorHandler.AuthError("Shop isn't registered")
    }
}

const checkAccessToken = async (keyStore, jwtToken, userId) => {

    //check accessToken
    if (!jwtToken) throw new errorHandler.ForBiddenRequestError("Not find jwtToken")
    const accessToken = getAccessTokenFromJWT(jwtToken)
    if (!accessToken) throw new errorHandler.ForBiddenRequestError("Not find access token")
    const publicKeyObject = await createPublicKeyObject(keyStore.publicKey);
    try {
        const decodeShop = await jwt.verify(accessToken, publicKeyObject)
        console.log("Decode shoppee", decodeShop)
        if (decodeShop.userid !== userId) throw new errorHandler.AuthError('invalid user id')
    } catch (error) {
        throw new errorHandler.AuthError("invalid access token")
    }
}

const checkRefreshToken = async (keyStore, req) => {
    try {
        const refreshToken = req.headers[HEADER.refreshToken]
        const userId = req.headers[HEADER.client_id]
        const publicKeyObject = await createPublicKeyObject(keyStore.publicKey);
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await TokenService.removeTokenById(keyStore._id)
            throw new errorHandler.ForBiddenRequestError('For security! pls login again')
        }
        const decodeShop = await jwt.verify(refreshToken, publicKeyObject)
        if (decodeShop.userid !== userId) throw new errorHandler.AuthError('invalid userId')
        req.keyStore = keyStore
        req.shop = decodeShop
        req.refreshToken = refreshToken
    } catch (error) {
        throw error
    }
}

const getAccessTokenFromJWT = (JWT) => {
    return JWT.split(' ')[1]
}

const createPublicKeyObject = async (publicKeyString) => {
    return await crypto.createPublicKey(publicKeyString)
}

module.exports = {
    HEADER,
    authentication
}