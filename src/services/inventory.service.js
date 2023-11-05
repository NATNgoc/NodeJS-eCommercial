const { ErrorResponse } = require('../core/error.response')
const InventoryRepository = require('../models/repository/inventory.repo')
const { objectIdParser } = require('../utils/index')
class InventoryService {
    // inventory_product_id: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: 'product'
    // },
    // inventory_location: {
    //     type: String,
    //     required: true,
    // },
    // inventory_stock: {
    //     type: Number,
    //     required: true
    // },
    // inventory_shop_id: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: 'shop'
    // },
    static async createNewInventory(shopId, productId, stock, location = 'Unkown') {
        const newInvetory = await InventoryRepository.insertNewInventory({
            inventory_product_id: objectIdParser(productId),
            inventory_location: location,
            inventory_stock: stock,
            inventory_shop_id: objectIdParser(shopId),

        })
        if (!newInvetory) throw new ErrorResponse.ErrorResponse("Something went wrong!!")
        return newInvetory
    }

}

module.exports = InventoryService