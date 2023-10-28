const lodash = require('lodash')

const getInfoData = (fields = [], object = {}) => {
    return lodash.pick(object, fields)
}

const emailRegrex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

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
    actionTokenService,
    emailRegrex
}