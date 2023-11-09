'use strict'
const mongoose = require('mongoose'); // Erase if already required
const CART_COLLECTION_NAME = 'carts'
const CART_DOCUMENTS_NAME = 'cart'
var cartSchema = new mongoose.Schema({
    cart_status: {
        type: String,
        require: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    // {
    //     product_id,
    //     shop_id,
    //     quantity,
    //     name,
    //     price
    // }
    cart_products_count: {
        type: Number,
        required: true,
        ref: 'shop',
        default: 0
    },
    cart_user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    collection: CART_COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(CART_DOCUMENTS_NAME, cartSchema)