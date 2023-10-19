
const AccessService = require('../services/access.service')
const SuccesResponse = require('../core/success.response')
const tokenModel = require('../models/token.model')
const TokenService = require('../services/token.service')
class AccessController {
    signUp = async (req, res, next) => {
        return new SuccesResponse.CreatedResponse({
            message: "Sign Up succesfully",
            metaData: await AccessService.signUp(req.body)
        }).send(res)
    }
    login = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            message: "Login succesfully!",
            metaData: await AccessService.login(req.body)
        }).send(res)
    }
    logout = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            message: "Logout succesfully!",
            metaData: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    refreshTokenAccess = async (req, res, next) => {
        return new SuccesResponse.OkResponse({
            message: "Refresh Token successfully!",
            metaData: await AccessService.refreshToken(
                req.keyStore,
                req.refreshToken,
                req.shop
            )
        }).send(res)
    }
}
const accessController = new AccessController()
module.exports = accessController