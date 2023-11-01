const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const express = require('express')
const router = express.Router()
const errorHanlder = require('../../core/error.response')


router.get('/search', errorHanlder.functionHanlder(productController.searchProductByKeyword))
router.get('/', errorHanlder.functionHanlder(productController.findAllProduct))
router.get('/:product_id', errorHanlder.functionHanlder(productController.findProductById))
router.use(errorHanlder.functionHanlder(authentication))
router.post('/create', errorHanlder.functionHanlder(productController.createProduct))
router.patch('/update/:id', errorHanlder.functionHanlder(productController.updateProductById))
router.get('/drafts/all', errorHanlder.functionHanlder(productController.findAllDraftsProduct))
router.get('/published/all', errorHanlder.functionHanlder(productController.findAllPublishedProducts))
router.patch('/publish/:id', errorHanlder.functionHanlder(productController.publishProduct))
router.patch('/unPublish/:id', errorHanlder.functionHanlder(productController.unPublishProduct))



module.exports = router