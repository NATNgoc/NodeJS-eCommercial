'use strict'
const mongoose = require('mongoose'); // Erase if already required
const CLOTHING_COLLECTION_NAME = 'clothings'
const CLOTHING_DOCUMENTS_NAME = 'clothing'
var clothingSchema = new mongoose.Schema({
    brand: {
        type: String,
        require: true
    },
    size: {
        type: Array,
        default: []
    },
    material: String,
    product_shop_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'shop'
    }
}, {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(CLOTHING_DOCUMENTS_NAME, clothingSchema)