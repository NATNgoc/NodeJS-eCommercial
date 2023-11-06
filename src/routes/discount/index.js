const express = require('express')
const router = express.Router()
const discountController = require('../../controllers/discount.controller')
const errorHanlder = require('../../core/error.response')
const { authentication } = require('../../auth/authUtils')
const discountValidator = require('../../middleware/validator/discount.validator')


router.get('/code/:discountCode', errorHanlder.functionHanlder(discountController.findAllProductByCode))
router.use(errorHanlder.functionHanlder(authentication))
router.post('/createDiscountCode', errorHanlder.functionHanlder(discountValidator.validateCreateDiscountCode), errorHanlder.functionHanlder(discountController.createNewDiscountCode))
router.get('/all', errorHanlder.functionHanlder(discountController.findAllDiscountCodeForShop))

module.exports = router