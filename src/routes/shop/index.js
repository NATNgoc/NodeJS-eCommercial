const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const express = require('express')
const router = express.Router()
const errorHanlder = require('../../core/error.response')
const initApiRoute = (app) => {
    router.use(errorHanlder.functionHanlder(authentication))
    router.post('/shop/product/createProduct', errorHanlder.functionHanlder(productController.createProduct))
    router.post('/shop/product/drafts', errorHanlder.functionHanlder(productController.findAllDraftsProduct))
    router.post('/shop/product/publishes', errorHanlder.functionHanlder(productController.findAllPublishedProducts))
    return app.use('/api/v1', router)
}

module.exports = initApiRoute