const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const errorHanlder = require('../../core/error.response')
const { authentication } = require('../../auth/authUtils')
const accessValiddator = require('../../middleware/validator/access.validator')
const initApiRoute = (app) => {
    router.post('/shop/signup', accessValiddator.validateSignUpRequest, errorHanlder.functionHanlder(accessController.signUp))
    router.post('/shop/login', accessValiddator.validateLoginRequest, errorHanlder.functionHanlder(accessController.login))
    router.use(errorHanlder.functionHanlder(authentication))
    router.post('/shop/logout', errorHanlder.functionHanlder(accessController.logout))
    router.post('/shop/refreshtoken', errorHanlder.functionHanlder(accessController.refreshTokenAccess))
    return app.use('/api/v1', router)
}

module.exports = initApiRoute


