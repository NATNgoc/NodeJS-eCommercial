
const availableProductModels = require('../product.model')
const productTypes = {
    PRODUCT: availableProductModels.productModel,
    CLOTHING: availableProductModels.clothingModel,
    ELECTRONIC: availableProductModels.electronicModel
}

class ProductRepository {

    /**
     * 
     * @param {*} type : "One type of productTypes"
     * @param {*} object : "Object want to create in db"
     */
    static async createSpecificProductType(type, object) {
        const model = productTypes[type]
        if (!model) return false
        return await model.create({ ...object })
    }

    /**
     * 
     * @param {*} filter : "Field or criteria you want to find"
     * @param {*} limit : "Limit the documents you want to see per time"
     * @param {*} skip : "Pagination"
     * @returns 
     */
    static async findAllProductByShopId(filter, limit, skip) {
        return await productTypes["PRODUCT"].find({ ...filter })
            .populate('product_shop_id')
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
    }

    static updateProduct() {

    }



}

module.exports = ProductRepository