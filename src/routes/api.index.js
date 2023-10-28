const express = require('express')
const router = express.Router()


const initApiRoute = (app) => {
    router.use('/shop', require('./access/index'))
    router.use('/product', require('./product/index'))
    return app.use("/api/v1", router)
}

module.exports = initApiRoute