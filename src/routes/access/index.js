const express = require('express')
const router = express.Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const accessController = require('../../controllers/access.controller')
const initApiRoute = (app) => {
    router.get('/shop/signup', accessController.signUp)
    return app.use('/api/v1', router)
}


module.exports = initApiRoute


