const { default: mongoose } = require('mongoose')
const clothingModel = require('../clothing.model')

class ClothingRepository {
    static async createClothingProduct(object) {
        return await clothingModel.create({ ...object })
    }

    /**
         * 
         * @param {*} filter : "Field or criteria you want to update"
         * @param {*} bodyUpdate : "The lastest updated content for the product"
         * @param {*} isNew : "Is it attribute to decide whether it return the new value or not"
         * @returns : "The new updated object if isNew parameter be true"
         */
    static async updateClothing(filter, bodyUpdate, isNew = true) {
        return await clothingModel.findOneAndUpdate(filter, {
            $set: { ...bodyUpdate }
        }, { new: isNew }).lean()
    }


}

module.exports = ClothingRepository