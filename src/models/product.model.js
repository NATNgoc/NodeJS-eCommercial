'use strict'
const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')
const PRODUCT_COLLECTION_NAME = 'products'
const PRODCUT_DOCUMENTS_NAME = 'product'

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String, required: true
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_slug: {
        type: String
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing']
    },
    product_variations: {
        type: Array,
        default: []
    },
    product_shop_id: {
        type: mongoose.Types.ObjectId,
        ref: 'shop',
        required: true
    },
    isDraft: {
        type: Boolean,
        default: true,
        required: true,
        select: false,
    },
    isPublish: {
        type: Boolean,
        default: false,
        required: true,
        select: false,
    }
}, {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true
});


productSchema.pre('save', function (next) {
    console.log(this.product_name)
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})



//Export the model
module.exports = mongoose.model(PRODCUT_DOCUMENTS_NAME, productSchema)
