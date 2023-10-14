
const { statusCode, reasonPhrases } = require('../utils/httpStatusCode')
// const errorStatus = {
//     FORBIDDEN: 403,
//     NOT_FOUND: 404,
//     CONFLICT: 409
// }
// const errorMessage = {
//     FORBIDDEN: "Bad request error",
//     NOT_FOUND: "Internal error network",
//     CONFLICT: "Conflict error"
// }

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonPhrases.CONFLICT, status = statusCode.CONFLICT) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = reasonPhrases.NOT_FOUND, status = statusCode.NOT_FOUND) {
        super(message, status)
    }
}

class AuthError extends ErrorResponse {
    constructor(message = reasonPhrases.UNAUTHORIZED, status = statusCode.UNAUTHORIZED) {
        super(message, status)
    }
}

class ForBiddenRequestError extends ErrorResponse {
    constructor(message = reasonPhrases.FORBIDDEN, status = statusCode.FORBIDDEN) {
        super(message, status)
    }
}

const functionHanlder = (targetFunction) => {
    return (req, res, next) => {
        targetFunction(req, res, next).catch(next)
    }
}

module.exports = {
    ErrorResponse,
    ConflictRequestError,
    ForBiddenRequestError,
    NotFoundError,
    AuthError,
    functionHanlder
}


