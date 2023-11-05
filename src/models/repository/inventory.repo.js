const inventoryModel = require('../invetory.model')

class InventoryRepository {

    static async insertNewInventory(object) {
        return await inventoryModel.create({
            ...object
        })
    }

}

module.exports = InventoryRepository