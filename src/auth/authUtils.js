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


const authentication = async (req, res, next) => {
    /*
    1 - check userId && accesstoken
    2 - check keystore (Kiểm tra người dùng đăng nhập hay chưa)
    3 - get access token
    4 - verify token by publickey
    */

    //check userID
    if (!req.headers[HEADER.client_id]) {
        throw new errorHandler.ForBiddenRequestError("invalid user id")
    }

    //check Keystore
    const keyStore = await TokenService.findByShopId(req.headers[HEADER.client_id])
    if (!keyStore) {
        throw new errorHandler.AuthError("User isn't login!")
    }
    req.keyStore = keyStore

    //check if it's for refreshToken task
    if (req.headers[HEADER.refreshToken]) {
        await handleForRefreshToken(keyStore, req)
        return next()
    }

    await handleForAccessToken(keyStore, req.headers[HEADER.autherization], req.headers[HEADER.client_id])
    return next()
}

const handleForAccessToken = async (keyStore, jwtToken, userId) => {

    //check accessToken
    if (!jwtToken) throw new errorHandler.ForBiddenRequestError("Not find jwtToken")
    const accessToken = getAccessTokenFromJWT(jwtToken)
    if (!accessToken) throw new errorHandler.ForBiddenRequestError("Not find access token")
    const publicKeyObject = await createPublicKeyObject(keyStore.publicKey);
    try {
        const decodeShop = await jwt.verify(accessToken, publicKeyObject)
        if (decodeShop.userid !== userId) throw new errorHandler.AuthError('invalid user id')
    } catch (error) {
        throw new errorHandler.AuthError("invalid access token")
    }
}

const handleForRefreshToken = async (keyStore, req) => {
    try {
        const refreshToken = req.headers[HEADER.refreshToken]
        const userId = req.headers[HEADER.client_id]
        const publicKeyObject = await createPublicKeyObject(keyStore.publicKey);
        const decodeShop = await jwt.verify(refreshToken, publicKeyObject)
        if (decodeShop.userid !== userId) throw new errorHandler.AuthError('invalid userId')
        req.keyStore = keyStore
        req.shop = decodeShop
        req.refreshToken = refreshToken
    } catch {
        throw new errorHandler.AuthError('invalide accessToken')
    }
}

const getAccessTokenFromJWT = (JWT) => {
    return JWT.split(' ')[1]
}

const createPublicKeyObject = async (publicKeyString) => {
    return await crypto.createPublicKey(publicKeyString)
}
module.exports = {
    authentication
}