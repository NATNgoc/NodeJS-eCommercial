const { ErrorResponse } = require('../core/error.response')
const InventoryRepository = require('../models/repository/inventory.repo')
const { objectIdParser } = require('../utils/index')
class InventoryService {

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