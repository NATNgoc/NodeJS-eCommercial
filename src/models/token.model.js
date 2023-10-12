'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key';
const COLLECTION_NAME = 'keys';

var keyTokenSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    publicKey: {
        type: String,
        require: true
    },
    refreshKey: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);