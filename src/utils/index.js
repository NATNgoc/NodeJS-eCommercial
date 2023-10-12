const lodash = require('lodash')

const getInfoData = (fields = [], object = {}) => {
    return lodash.pick(object, fields)
}

module.exports = {
    getInfoData
}