const { default: mongoose } = require('mongoose')
const electronicModel = require('../electronic.model')

class ElectronnicRepository {
    static async createElectronicProduct(object) {
        return await electronicModel.create({ ...object })
    }

    /**
     * 
     * @param {*} filter : "Field or criteria you want to update"
     * @param {*} bodyUpdate : "The lastest updated content for the product"
     * @param {*} isNew : "Is it attribute to decide whether it return the new value or not"
     * @returns : "The new updated object if isNew parameter be true"
     */
    static async updateElectronic(filter, bodyUpdate, isNew = true) {
        return await electronicModel.updateMany(filter, {
            $set: {
                ...bodyUpdate
            }
        }, { isNew: isNew })
    }

}


module.exports = ElectronnicRepository