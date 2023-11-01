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

const nestedObjectParser = (object, parent = '', result = {}) => {
    const currentParent = parent === '' ? parent : (parent + '.')
    Object.keys(object).forEach(key => {
        const prefix = currentParent + key
        if (typeof object[key] == 'object' && !Array.isArray(object[key])) {
            nestedObjectParser(object[key], currentParent + key, result)
        } else {
            result[prefix] = object[key]
        }
    })
    return result
}

const removeNullOrUnderfinedObject = (object) => {
    Object.keys(object).forEach(key => {
        if (!object[key]) {
            delete object[key]
        }
    })
    return object
}

const objectIdParser = (objectId) => {
    return new mongoose.Types.ObjectId(objectId)
}

const filterFieldsByPrefix = (object, prefix) => {
    const result = {};
    const remaining = {};
    Object.keys(object).forEach(key => {
        if (key.startsWith(prefix)) {
            result[key] = object[key];
        } else {
            remaining[key] = object[key];
        }
    });

    return { result, remaining };
};
module.exports = {
    getInfoData,
    isEmptyObject,
    actionTokenService,
    emailRegrex,
    getSelectDataForQuery,
    getUnselectDataForQuery,
    nestedObjectParser,
    removeNullOrUnderfinedObject,
    objectIdParser,
    filterFieldsByPrefix
}