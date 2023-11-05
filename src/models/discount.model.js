
const mongoose = require('mongoose'); // Erase if already required
const DISCOUNT_COLLECTION_NAME = 'discounts'
const DISCOUNT_DOCUMENTS_NAME = 'discount'
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true,
    },
    discount_type: {
        type: String,
        enum: ['fix_amount', 'percentage'],
        required: true
    },
    discount_value: {
        type: Number,
        required: true,
    },
    discount_code: {
        type: String,
        require: true
    },
    discount_start_at: {
        type: Date,
        required: true
    },
    discount_end_at: {
        type: Date,
        required: true
    },
    discount_max_uses: {
        type: Number,
        required: true
    },
    discont_used_count: {
        type: Number,
        required: true,
        default: 0
    },
    discount_users_used: {
        type: Array,
        default: []
    },
    discount_max_use_per_user: {
        type: Number,
        required: true
    },
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shop_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    discount_is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    discount_apply_for: {
        type: String,
        enum: ['all', 'specific'],
        required: true
    },
    discount_product_ids: {
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
    collection: DISCOUNT_COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DISCOUNT_DOCUMENTS_NAME, discountSchema);