const express = require('express')
const router = express.Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const accessController = require('../../controllers/access.controller')
const tokenModel = require('../../models/token.model')

const initApiRoute = (app) => {
    router.post('/shop/signup', accessController.signUp)
    router.post('/shop/login', accessController.login)
    router.get('/users', verifyToken, (req, res) => {
        return res.status(201).send({
            shop: 'Nguyễn Anh Tuấn Ngọc',
            code: 20001
        })
    })

    return app.use('/api/v1', router)
}
const verifyToken = async (req, res, next) => {
    const jwtoken = req.headers.authorization
    const key = jwtoken.split(' ')[1]
    const publicKeyString = await getPublicKey()
    const publicKey = await crypto.createPublicKey(publicKeyString)
    await jwt.verify(key, publicKey, (err, data) => {
        if (err) res.status(401).send(err)
        next()
    })
}

const getPublicKey = async () => {
    const token = await tokenModel.findOne({});
    return token.publicKey;
}

module.exports = initApiRoute


