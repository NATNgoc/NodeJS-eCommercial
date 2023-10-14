'use strict'

const { statusCode, reasonPhrases } = require('../utils/httpStatusCode')
//Custom message and status code
// const successStatus = {
//     OK: 200,
//     CREATED: 201
// }
// const succesMessage = {
//     OK: 'Success!',
//     CREATED: 'Created!'
// }


class SuccesResponse {
    constructor({ message, status, reason, metaData = {} }) {
        this.message = !message ? reason : message
        this.statusCode = status
        this.metaData = metaData
    }

    send(res, header = {}) {
        return res.status(this.statusCode).json(this)
    }
}

class OkResponse extends SuccesResponse {
    constructor({ message, status = statusCode.OK, reason = reasonPhrases.OK, metaData = {} }) {
        super({ message, status, reason, metaData })
    }
}

class CreatedResponse extends SuccesResponse {
    constructor({ message, status = statusCode.CREATED, reason = reasonPhrases.CREATED, metaData = {} }) {
        super({ message, status, reason, metaData })
    }
}

module.exports = {
    OkResponse,
    CreatedResponse,
    SuccesResponse
}

