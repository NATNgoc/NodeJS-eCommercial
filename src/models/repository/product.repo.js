
const { default: mongoose } = require('mongoose')
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
    static async findProduct(filter, limit, skip, sortOption = {}) {
        return await productTypes["PRODUCT"].find({ ...filter })
            .sort(sortOption)
            .populate('product_shop_id')
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
    }


    /**
     * 
     * @param {*} filter : Field or criteria you want to find
     * @param {*} limit :Limit the documents you want to see per time
     * @param {*} skip : "Pagination"
     * @param {*} select : The field you want to attached in response
     * @param {*} sortOption : option for sort the result
     * @returns 
     */
    static async findAllProduct(filter, limit, skip, select, sortOption = {}) {
        console.log("Hello")
        return await productTypes["PRODUCT"].find({ ...filter })
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .select(select)
            .lean()
            .exec()
    }




    static async findProductById({ product_id, unSelect }) {
        return await productTypes["PRODUCT"]
            .findById(new mongoose.Types.ObjectId(product_id))
            .select(unSelect)
            .lean()
            .exec()
    }



    static async updateProductByShopId(productId, shopId, udpateObject) {
        return await productTypes["PRODUCT"].findOneAndUpdate({
            _id: new mongoose.Types.ObjectId(productId),
            product_shop_id: new mongoose.Types.ObjectId(shopId)
        }, udpateObject)
    }



}

module.exports = ProductRepository