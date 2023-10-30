const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')
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


//Export the model
module.exports = {
    productModel: mongoose.model(PRODCUT_DOCUMENTS_NAME, productSchema),
    clothingModel: mongoose.model(CLOTHING_DOCUMENTS_NAME, clothingSchema),
    electronicModel: mongoose.model(ELECTRONIC_DOCUMENTS_NAME, electionicSchema)
}