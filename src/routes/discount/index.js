const express = require('express')
const router = express.Router()
const discountController = require('../../controllers/discount.controller')
const errorHanlder = require('../../core/error.response')
const { authentication } = require('../../auth/authUtils')
const discountValidator = require('../../middleware/validator/discount.validator')


router.get('/products', errorHanlder.functionHanlder(discountController.findAllProductByCodeForUser))
router.use(errorHanlder.functionHanlder(authentication))
router.post('/', errorHanlder.functionHanlder(discountValidator.validateCreateDiscountCode), errorHanlder.functionHanlder(discountController.createNewDiscountCode))
router.delete('/', errorHanlder.functionHanlder(discountValidator.validateDeleteDiscountCode), errorHanlder.functionHanlder(discountController.deleteDiscountCode))
router.get('/all', errorHanlder.functionHanlder(discountController.findAllDiscountCodeForShop))
router.get('/apply', errorHanlder.functionHanlder(discountController.getDiscountCodeAmount))
module.exports = router