const ErrorResponse = require('../../core/error.response')
const { emailRegrex } = require('../../utils/index')
const validateLoginRequest = (req, res, next) => {
    const { email, password } = req.body

    if (!email || email.length < 0) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid email! pls check again")
    }
    if (!password || password.length < 8) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid password! pls check again")
    }

    next()
}

const validateSignUpRequest = (req, res, next) => {
    const { email, password, name } = req.body
    if (!email || !password || !name) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid information! pls check again")
    }

    if (email.length < 8) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid email! pls check again")
    }

    if (!emailRegrex.test(email)) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid email! pls check again")
    }

    if (password.length < 8) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid password! pls check again")
    }

    if (name.length <= 0) {
        throw new ErrorResponse.ForBiddenRequestError("unvalid name! pls check again")
    }

    next()

}

module.exports = {
    validateLoginRequest,
    validateSignUpRequest
}