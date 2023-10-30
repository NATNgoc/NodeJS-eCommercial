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

const getSelectDataForQuery = (select) => {
    return Object.fromEntries(select.map(it => [it, 1]))
}

const getUnselectDataForQuery = (select) => {
    return Object.fromEntries(select.map(it => [it, 0]))
}

module.exports = {
    getInfoData,
    isEmptyObject,
    actionTokenService,
    emailRegrex,
    getSelectDataForQuery,
    getUnselectDataForQuery
}