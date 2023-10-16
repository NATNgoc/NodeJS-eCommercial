const jwt = require("jsonwebtoken")
const errorHandler = require("../core/error.response")
const TokenService = require("../services/token.service")
const { Types } = require('mongoose')
const crypto = require('crypto')
const HEADER = {
    client_id: 'x-client-id',
    accesstoken: 'authorization',
}


const authentication = async (req, res, next) => {
    /*
    1 - check userId
    2 - check keystore (Kiểm tra người dùng đăng nhập hay chưa)
    3 - get access token
    4 - verify token
    */

    //check userID
    if (!req.headers[HEADER.client_id]) {
        throw new errorHandler.NotFoundError('invalid id')
    }

    //check Keystore
    const keyStore = await TokenService.findByShopId(req.headers[HEADER.client_id])
    if (!keyStore) {
        throw new errorHandler.NotFoundError('Not valid user')
    }
    req.keyStore = keyStore
    //check access token
    if (!req.headers.authorization) {
        throw new errorHandler.NotFoundError('Not found access token')
    }
    const jwtoken = req.headers.authorization
    const accessToken = jwtoken.split(' ')[1]
    if (!accessToken) {
        throw new errorHandler.AuthError('Not valid access Token')
    }

    //verify token
    try {
        const publicKeyObject = await crypto.createPublicKey(keyStore.publicKey);
        console.log("Access token::::", accessToken, publicKeyObject)
        jwt.verify(accessToken, publicKeyObject)
    } catch (err) {
        throw new errorHandler.AuthError("invalid access token")
    }

    next()
}

module.exports = {
    authentication
}