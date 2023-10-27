const mongoose = require('mongoose'); // Erase if already required
const PRODUCT_COLLECTION_NAME = 'products'
const PRODCUT_DOCUMENTS_NAME = 'product'
const CLOTHING_COLLECTION_NAME = 'clothings'
const CLOTHING_DOCUMENTS_NAME = 'clothing'
const ELECTIONIC_COLLECTION_NAME = 'electronics'
const ELECTRONIC_DOCUMENTS_NAME = 'electronic'
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
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing']
    },
    product_shop_id: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true
});

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
        ref: 'shops'
    }
}, {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true
})

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
        ref: 'shops'
    }
}, {
    collection: ELECTIONIC_COLLECTION_NAME,
    timestamps: true
})


//Export the model
module.exports = {
    productModel: mongoose.model(PRODCUT_DOCUMENTS_NAME, productSchema),
    clothingModel: mongoose.model(CLOTHING_DOCUMENTS_NAME, clothingSchema),
    electronicModel: mongoose.model(ELECTRONIC_DOCUMENTS_NAME, electionicSchema)
}