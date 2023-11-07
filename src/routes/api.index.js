const express = require('express')
const router = express.Router()



const initApiRoute = (app) => {
    router.use('/shops', require('./access/index'))
    router.use('/products', require('./product/index'))
    router.use('/discounts', require('./discount/index'))
    return app.use("/api/v1", router)
}

module.exports = initApiRoute