const lodash = require('lodash')
const { default: mongoose } = require('mongoose')

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



function filterPayLoad(payload) {
    return nestedObjectParser(payload)
}
const nestedObjectParser = (object, parent = '', result = {}) => {
    if (object && typeof object === 'object') {
        const currentParent = parent === '' ? parent : (parent + '.')
        Object.keys(object).forEach(key => {
            const prefix = currentParent + key
            if (typeof object[key] == 'object' && !Array.isArray(object[key])) {
                nestedObjectParser(object[key], currentParent + key, result)
            } else {
                result[prefix] = object[key] || null
            }
        })
    }
    return result
}


const objectIdParser = (objectId) => {
    return new mongoose.Types.ObjectId(objectId)
}

module.exports = {
    getInfoData,
    isEmptyObject,
    actionTokenService,
    emailRegrex,
    getSelectDataForQuery,
    getUnselectDataForQuery,
    nestedObjectParser,
    objectIdParser,
    filterPayLoad
}