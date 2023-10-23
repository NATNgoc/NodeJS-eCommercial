const lodash = require('lodash')

const getInfoData = (fields = [], object = {}) => {
    return lodash.pick(object, fields)
}

const isEmptyObject = (object) => {
    return Object.keys(object).length === 0
}

module.exports = {
    getInfoData,
    isEmptyObject
}