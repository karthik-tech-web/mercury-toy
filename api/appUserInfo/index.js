const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');
const config = require('../../system/utils/config');

const dataSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneNumber1: String,
    phoneNumber2: String,
    photoUrl: {
        type: String,
        default: null,
    },
    gallery: {
        type: Array,
        default: null,
    },
    address1: String,
    address2: String,
    openingDay: Date,
    closingDay: Date,
    openingTime: String,
    closingTime: String,
    gelocation: String,
    defaultGst: {
        type: Number,
        default: 18,
    },
    dcChennai: {
        type: Number,
        default: 50,
    },
    dcOuterChennai: {
        type: Number,
        default: 100,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const getModel = async () => dbConn.model('appUserInfo', dataSchema, 'appUserInfo');

module.exports = { getModel };