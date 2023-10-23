const express = require('express')
const router = express.Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const accessController = require('../../controllers/access.controller')
const tokenModel = require('../../models/token.model')
const errorHanlder = require('../../core/error.response')
const { authentication } = require('../../auth/authUtils')
const initApiRoute = (app) => {
    router.post('/shop/signup', errorHanlder.functionHanlder(accessController.signUp))
    router.post('/shop/login', errorHanlder.functionHanlder(accessController.login))
    router.use(errorHanlder.functionHanlder(authentication))
    router.post('/shop/logout', errorHanlder.functionHanlder(accessController.logout))
    router.post('/shop/refreshtoken', errorHanlder.functionHanlder(accessController.refreshTokenAccess))
    return app.use('/api/v1', router)
}

module.exports = initApiRoute


