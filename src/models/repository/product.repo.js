
const { default: mongoose } = require('mongoose')
const productModel = require('../product.model')

class ProductRepository {

    /**
     * 
     * @param {*} object : "Object want to create in db"
     */
    static async createProduct(object) {
        return await productModel.create({ ...object })
    }

    /**
     * 
     * @param {*} filter : "Field or criteria you want to find"
     * @param {*} limit : "Limit the documents you want to see per time"
     * @param {*} skip : "Pagination"
     * @returns 
     */
    static async findProduct(filter, limit, skip, sortOption = {}) {
        return await productModel.find({ ...filter })
            .sort(sortOption)
            .populate('product_shop_id')
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
    }


    /**
     * 
     * @param {*} filter : "Field or criteria you want to update"
     * @param {*} bodyUpdate : "The lastest updated content for the product"
     * @param {*} isNew : "Is it attribute to decide whether it return the new value or not"
     * @returns : "The new updated object if isNew parameter be true"
     */
    static async updateProduct(filter, bodyUpdate, isNew = true) {
        return await productModel.findOneAndUpdate(filter,
            {
                $set:
                    { ...bodyUpdate }
            },
            { new: isNew }).lean();
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
        return await productModel.find({ ...filter })
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .select(select)
            .lean()
            .exec()
    }




    static async findProductById({ product_id, unSelect }) {
        return await productModel
            .findById(new mongoose.Types.ObjectId(product_id))
            .select(unSelect)
            .lean()
            .exec()
    }



    static async updateProductByShopId(productId, shopId, udpateObject) {
        return await productModel.findOneAndUpdate({
            _id: new mongoose.Types.ObjectId(productId),
            product_shop_id: new mongoose.Types.ObjectId(shopId)
        }, udpateObject)
    }



}

module.exports = ProductRepository