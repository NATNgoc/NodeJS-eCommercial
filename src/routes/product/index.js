const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const express = require('express')
const router = express.Router()
const errorHanlder = require('../../core/error.response')

router.use(errorHanlder.functionHanlder(authentication))
router.post('/createProduct', errorHanlder.functionHanlder(productController.createProduct))
router.post('/drafts/all', errorHanlder.functionHanlder(productController.findAllDraftsProduct))
router.post('/published/all', errorHanlder.functionHanlder(productController.findAllPublishedProducts))
router.patch('/publish/:id', errorHanlder.functionHanlder(productController.publishProduct))



module.exports = router