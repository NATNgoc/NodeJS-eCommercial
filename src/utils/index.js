const lodash = require('lodash')

const getInfoData = (fields = [], object = {}) => {
    return lodash.pick(object, fields)
}

const isEmptyObject = (object) => {
    return Object.keys(object).length === 0
}

const actionTokenService = {
    CREATE_NEW_TOKEN: "create",
    REFRESH_TOKEN: "refresh"
}

module.exports = {
    getInfoData,
    isEmptyObject,
    actionTokenService
}