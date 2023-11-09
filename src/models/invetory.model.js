'use strict'
const mongoose = require('mongoose'); // Erase if already required
const INVENTORY_COLLECTION_NAME = 'inventories'
const INVENTORY_DOCUMENTS_NAME = 'inventory'
// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inventory_product_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'product'
    },
    inventory_location: {
        type: String,
        required: true,
    },
    inventory_stock: {
        type: Number,
        required: true
    },
    inventory_shop_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'shop'
    },
    inventory_reservation: {
        type: Array,
        default: []
    }
    /*
        cart_id:
        stock: 1,
        createdAt:
    */
}, {
    timestamps: true,
    collection: INVENTORY_COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(INVENTORY_DOCUMENTS_NAME, inventorySchema);