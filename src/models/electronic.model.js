'use strict'
const mongoose = require('mongoose'); // Erase if already required
const ELECTIONIC_COLLECTION_NAME = 'electronics'
const ELECTRONIC_DOCUMENTS_NAME = 'electronic'
var electionicSchema = new mongoose.Schema({
    type_connect: {
        type: String,
        required: true,
        enum: ['Bluetooth', 'Wired']
    },
    battery_capacity: {
        type: Number,
    },
    warranty_time: {
        type: String,
        required: true
    },
    product_shop_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'shop'
    }
}, {
    collection: ELECTIONIC_COLLECTION_NAME,
    timestamps: true
})

module.exports = mongoose.model(ELECTRONIC_DOCUMENTS_NAME, electionicSchema)