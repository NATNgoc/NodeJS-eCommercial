'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key';
const COLLECTION_NAME = 'keys';

var keyTokenSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'shops'
    },
    publicKey: {
        type: String,
        require: true
    },
    refreshTokenUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);