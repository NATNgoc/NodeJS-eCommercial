const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const errorHanlder = require('../../core/error.response')
const { authentication } = require('../../auth/authUtils')
const accessValiddator = require('../../middleware/validator/access.validator')


router.post('/signup', accessValiddator.validateSignUpRequest, errorHanlder.functionHanlder(accessController.signUp))
router.post('/login', accessValiddator.validateLoginRequest, errorHanlder.functionHanlder(accessController.login))
router.use(errorHanlder.functionHanlder(authentication))
router.post('/logout', errorHanlder.functionHanlder(accessController.logout))
router.post('/refreshtoken', errorHanlder.functionHanlder(accessController.refreshTokenAccess))


module.exports = router


